export default function PrismaAdapter(p) {
  return {
    // CRUD
    createProduct: (data) => p.product.create({ data }),
    getProduct: async (cursor = 0) => {
      let items = await p.product.findMany({
        skip: cursor * 20,
        take: 20,
        select: {
          id: true,
          title: true,
          type: true,
          quantity_total: true,
          discount: true,
          price: true,
          list_price: true,
          brand: true,
          images: {
            take: 1
          }, // Returns all fields for all images
        },
      });
      let allpage = Math.ceil((await p.product.count()) / 20) - 1;

      return {
        items,
        cursor,
        allpage,
        hasNextPage: allpage > cursor,
        hasPreviousPage: cursor > 0,
      };
    },

    getProductById: (id) =>
      p.product.findUnique({
        where: { id },
        include: {
          images: true,
          variants: {
            where: {
              quantity: {
                gt: 0
              }
            }
          }
        },
      }),
    getProductByIdForCart: (id) =>
      p.product.findUnique({
        where: { id },
        select: {
          id: true,
          title: true,
          price: true,
          list_price: true,
          discount: true,
          quantity: true,
        },
      }),
    getProductSearch: (_) =>
      p.product.findMany({
        where: {
          quantity_total: {
            gt: 0,
          },
        },
        select: {
          id: true,
          title: true,
        },
      }),
    getProductByBrand: (brand) => p.product.findMany({ where: { brand } }),
    updateProduct: ({ id, ...data }) =>
      p.product.update({
        where: { id },
        data,
      }),
    // Beware when use
    deleteProduct: ({ id }) => p.product.delete({ where: { id } }),
  };
}
