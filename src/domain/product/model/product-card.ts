export class ProductCard {
  constructor(
    public id: number,
    public productId: number,
    public title: string,
    public imageUrl: string,
    public cardMappedMediaId: number,
    public description?: string,
    public count?: number,
    public percent?: number,
  ) {}
}
