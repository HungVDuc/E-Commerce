const productResource = (data) => ({
  id: data._id,
  name: data.name,
  description: data.description,
  basePrice: data.basePrice,
  categoryId: data.categoryId,
  createdAt: data.createdAt,
  updatedAt: data.updatedAt,
  variants: data.variants?.map((variant) => ({
    id: variant._id,
    color: variant.colorId?.name || variant.color?.name,
    size: variant.sizeId?.name || variant.size?.name,
    quantity: variant.quantity,
    price: variant.price,
    image: variant.image
      ? {
          url: variant.image.url,
          alt: variant.image.alt,
        }
      : null,
  })),
});

module.exports = productResource;
