export abstract class Entity<Props = any> {
  private _id: number;
  protected readonly props: Props;

  constructor(props: Props, id?: number) {
    this.props = props;
    this._id = id || null;
  }

  private set id(id: number) {
    this._id = id;
  }

  get id() {
    return this._id;
  }

  toJSON(): Required<{ id: number } & Props> {
    return {
      id: this._id,
      ...this.props,
    } as Required<{ id: number } & Props>;
  }
}
