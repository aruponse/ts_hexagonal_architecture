#!/usr/bin/env node

/**
 * Script para validar que el build del proyecto funciona correctamente
 */

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔨 Validando build del proyecto...');
console.log('=====================================');

let allTestsPassed = true;
let serverProcess = null;

function addResult(test, passed, message, details) {
  const icon = passed ? '✅' : '❌';
  console.log(`${icon} ${test}: ${message}`);
  if (details) {
    console.log(`   ${details}`);
  }
  if (!passed) allTestsPassed = false;
}

function runCommand(command, description) {
  try {
    console.log(`\n📋 ${description}...`);
    const output = execSync(command, { 
      encoding: 'utf8', 
      stdio: 'pipe',
      cwd: process.cwd()
    });
    console.log(`✅ ${description} - ÉXITO`);
    if (output.trim()) {
      console.log(`   Output: ${output.trim()}`);
    }
    return { success: true, output: output.trim() };
  } catch (error) {
    console.log(`❌ ${description} - FALLO`);
    console.log(`   Error: ${error.message}`);
    if (error.stdout) {
      console.log(`   Output: ${error.stdout}`);
    }
    if (error.stderr) {
      console.log(`   Error Output: ${error.stderr}`);
    }
    return { success: false, error: error.message };
  }
}

function checkFile(filePath, description) {
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${description} - Encontrado`);
    return true;
  } else {
    console.log(`❌ ${description} - No encontrado: ${filePath}`);
    return false;
  }
}

async function validateBuild() {
  console.log('\n🔧 1. Verificando archivos de configuración...');
  allTestsPassed &= checkFile('package.json', 'Archivo package.json');
  allTestsPassed &= checkFile('tsconfig.json', 'Archivo tsconfig.json');
  allTestsPassed &= checkFile('src/index.ts', 'Archivo principal src/index.ts');

  console.log('\n📦 2. Verificando dependencias...');
  const depsCheck = runCommand('bun install', 'Instalación de dependencias');
  allTestsPassed &= depsCheck.success;

  console.log('\n🏗️ 3. Ejecutando build...');
  const buildCheck = runCommand('bun run build', 'Build del proyecto');
  allTestsPassed &= buildCheck.success;

  if (buildCheck.success) {
    console.log('\n📁 4. Verificando archivos generados...');
    allTestsPassed &= checkFile('dist/index.js', 'Archivo build generado');
    
    const stats = fs.statSync('dist/index.js');
    const fileSizeKB = Math.round(stats.size / 1024);
    console.log(`✅ Tamaño del archivo build: ${fileSizeKB} KB`);
    
    if (fileSizeKB < 100) {
      console.log(`⚠️  Archivo build muy pequeño, podría estar vacío`);
      allTestsPassed = false;
    }
  }

  console.log('\n🚀 5. Probando ejecución del build...');
  if (buildCheck.success && fs.existsSync('dist/index.js')) {
    try {
      // Iniciar servidor en background
      serverProcess = spawn('bun', ['run', 'dist/index.js'], {
        stdio: 'pipe',
        env: { ...process.env, NODE_ENV: 'development', PORT: '3001' }
      });

      // Esperar a que el servidor inicie
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Timeout esperando servidor'));
        }, 10000);

        serverProcess.stdout.on('data', (data) => {
          const output = data.toString();
          if (output.includes('Server running') || output.includes('🚀')) {
            clearTimeout(timeout);
            resolve();
          }
        });

        serverProcess.stderr.on('data', (data) => {
          console.log(`   Server stderr: ${data.toString()}`);
        });

        serverProcess.on('error', (error) => {
          clearTimeout(timeout);
          reject(error);
        });
      });

      console.log('✅ Servidor iniciado correctamente');

      // Probar endpoint de health
      await new Promise(resolve => setTimeout(resolve, 2000)); // Esperar 2 segundos
      
      try {
        const healthCheck = execSync('curl -s http://localhost:3001/health', { 
          encoding: 'utf8',
          timeout: 5000
        });
        
        if (healthCheck.includes('"status":"OK"')) {
          console.log('✅ Health check exitoso');
          console.log(`   Response: ${healthCheck.trim()}`);
        } else {
          console.log('❌ Health check falló');
          console.log(`   Response: ${healthCheck}`);
          allTestsPassed = false;
        }
      } catch (error) {
        console.log('❌ No se pudo conectar al servidor');
        console.log(`   Error: ${error.message}`);
        allTestsPassed = false;
      }

    } catch (error) {
      console.log('❌ Error iniciando servidor');
      console.log(`   Error: ${error.message}`);
      allTestsPassed = false;
    }
  }

  console.log('\n🎯 RESULTADO FINAL:');
  if (allTestsPassed) {
    console.log('🎉 BUILD VALIDACIÓN EXITOSA');
    console.log('✅ El proyecto se compila correctamente');
    console.log('✅ El archivo build se genera sin errores');
    console.log('✅ El servidor inicia y responde correctamente');
    console.log('\n📋 Comandos disponibles:');
    console.log('   bun run build              # Build básico');
    console.log('   bun run build:prod         # Build para producción');
    console.log('   bun run build:with-migrations # Build con migraciones');
    console.log('   bun run start:dist         # Ejecutar build');
  } else {
    console.log('❌ BUILD VALIDACIÓN FALLÓ');
    console.log('❌ Revisa los errores anteriores');
    console.log('❌ Corrige los problemas antes de continuar');
  }

  // Limpiar proceso del servidor
  if (serverProcess) {
    serverProcess.kill();
  }

  if (!allTestsPassed) {
    process.exit(1);
  }
}

// Ejecutar validación
validateBuild().catch(console.error);
