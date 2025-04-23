import { Entity } from '../../entity';

type StubProps = {
  prop1: string;
  prop2: number;
};
class StubEntity extends Entity<StubProps> {}
describe('Entity unit test', () => {
  it('Should set props and not id', () => {
    const props = { prop1: 'value1', prop2: 15 };
    const entity = new StubEntity(props);

    expect(entity.props).toEqual(props);
    expect(entity.id).toBeNull();
  });

  it('Should accept a valid number', () => {
    const props = { prop1: 'value1', prop2: 15 };
    const id = 1;
    const entity = new StubEntity(props, id);

    expect(entity.id).toBe(id);
  });

  it('Should convert a entity to a Javascript Object', () => {
    const props = { prop1: 'value1', prop2: 15 };
    const id = 1;
    const entity = new StubEntity(props, id);

    expect(entity.toJSON()).toStrictEqual({
      id,
      ...props,
    });
  });
});
