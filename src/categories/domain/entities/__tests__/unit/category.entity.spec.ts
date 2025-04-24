import { CategoryEntity } from '../../category.entity';

describe('Category Entity Unit Tests', () => {
  it('should create a category entity with default createdAt date', () => {
    const category = new CategoryEntity({ name: 'Test Category' });
    expect(category.name).toBe('Test Category');
    expect(category.createdAt).toBeInstanceOf(Date);
  });

  it('should create a category entity with custom createdAt date', () => {
    const customDate = new Date('2023-01-01');
    const category = new CategoryEntity({
      name: 'Test Category',
      createdAt: customDate,
    });
    expect(category.name).toBe('Test Category');
    expect(category.createdAt).toEqual(customDate);
  });

  it('should return the correct id', () => {
    const category = new CategoryEntity({ name: 'Test Category' }, 1);
    expect(category.id).toBe(1);
  });

  it('should return the correct JSON representation', () => {
    const customDate = new Date('2023-01-01');
    const category = new CategoryEntity(
      { name: 'Test Category', createdAt: customDate },
      1,
    );
    expect(category.toJSON()).toEqual({
      id: 1,
      name: 'Test Category',
      createdAt: customDate,
    });
  });
});
