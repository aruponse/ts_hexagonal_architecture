export class Role {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  static create(name: string, description: string): Role {
    const now = new Date();
    return new Role(
      '', // ID será asignado por la base de datos
      name,
      description,
      now,
      now
    );
  }

  isAdmin(): boolean {
    return this.name === 'admin';
  }

  isUser(): boolean {
    return this.name === 'user';
  }
}

