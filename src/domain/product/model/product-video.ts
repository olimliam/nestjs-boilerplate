export class ProductVideo {
  constructor(
    public id: number,
    public productId: number,
    public title: string,
    public description: string,
    public url: string,
    public count?: number,
    public percent?: number,
  ) {}
}
