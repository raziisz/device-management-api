import { CategoryEntity } from '@/categories/domain/entities/category.entity';
import { CategoryOutputMapper } from '../../category.output';

describe('CategoryOutputMapper Unit tests', () => {
  it('Should convert a CategoryEntity to CategoryOutput', () => {
    const categoryEntity = new CategoryEntity(
      {
        name: 'Test Category',
        createdAt: new Date('2023-01-01'),
      },
      1,
    );
    const spyToJson = jest.spyOn(categoryEntity, 'toJSON');
    const sut = CategoryOutputMapper.toOutput(categoryEntity);

    expect(spyToJson).toHaveBeenCalled();
    expect(sut).toEqual(categoryEntity.toJSON());
  });
});
