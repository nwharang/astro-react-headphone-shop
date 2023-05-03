export default function PrismaAdapter(p) {

  return {
    // cart Item 
    addToCart: async (data) => {
      const { variantId, productId, userId } = data;
      let cart = await p.user.update({
        where: {
          id: userId,
        },
        select: { cartItem: true },
        data: {
          cartItem: {
            upsert: {
              where: {
                variantId_userId: {
                  variantId,
                  userId
                }
              },
              create: {
                variantId,
                productId,
                quantity: 1
              },
              update: {
                quantity: {
                  increment: 1,
                }
              }
            }
          }
        }
      })
      return { status: cart ? 'success' : "failed" }

    },
    getItems: async (userId) => {
      let { cartItem } = await p.user.findUnique({
        where: {
          id: userId,
        },
        select: { cartItem: true }
      })

      let data = await p.product.findMany({
        where: {
          OR: cartItem.map(e => {
            return {
              id: e.productId
            }
          })
        },
        select: {
          title: true,
          type: true,
          discount: true,
          price: true,
          list_price: true,
          brand: true,
          images: {
            take: 1
          },
          variants: {
            where: {
              OR: cartItem.map(e => {
                return {
                  id: e.variantId
                }
              })
            },
          }
        },
      })
      data.map(product => product.variants.map(variant =>
        variant.quantity = cartItem.find(v => v.variantId === variant.id).quantity
      ))
      return data
    },
    updateCart: () => { },
    deleteCartItem: (data) => {
      const { variantId, userId } = data;
      return p.cartItem.delete({
        where: {
          variantId_userId: {
            variantId,
            userId
          }
        },
      })
    }
  };
}

// {
//   "result": {
//     "data": [
//       {
//         "title": "Sony MDR-ZX110AP Extra Bass On Ear Headphones with Mic",
//         "type": "Headphones",
//         "discount": 15,
//         "price": 21,
//         "list_price": 24,
//         "brand": "Sony",
//         "images": [
//           {
//             "id": "63c1b0a2cc41579fdb306ad7",
//             "productId": "63c1b096cc41579fdb30641d",
//             "url": "https://res.cloudinary.com/dapxj4quf/assets/mdrzx110ap_large.jpg",
//             "alt": ""
//           }
//         ],
//         "variants": [
//           {
//             "id": "63c1b09ccc41579fdb306681",
//             "productId": "63c1b096cc41579fdb30641d",
//             "quantity": 4,
//             "sku": "mdrzx110ap",
//             "barcode": "027242879416",
//             "options": "Title,Default Title"
//           }
//         ]
//       },
//       {
//         "title": "Ultrasone Performance 880 Headphone",
//         "type": "Headphones",
//         "discount": 0,
//         "price": 499,
//         "list_price": 0,
//         "brand": "Ultrasone",
//         "images": [
//           {
//             "id": "63c1b0a2cc41579fdb306ae1",
//             "productId": "63c1b096cc41579fdb306421",
//             "url": "https://res.cloudinary.com/dapxj4quf/assets/Performance_880-125_1200x1200_1200x1200_530ff719-1970-4fdd-81ca-77e4225679e4_large.png",
//             "alt": ""
//           }
//         ],
//         "variants": [
//           {
//             "id": "63c1b09ccc41579fdb306684",
//             "productId": "63c1b096cc41579fdb306421",
//             "quantity": 2,
//             "sku": "ULPERF880",
//             "barcode": "4043941133013",
//             "options": "Title,Default Title"
//           }
//         ]
//       },
//       {
//         "title": "JBL Reflect Contour 2",
//         "type": "In-Ear Headphones",
//         "discount": 15,
//         "price": 84,
//         "list_price": 99,
//         "brand": "JBL",
//         "images": [
//           {
//             "id": "63c1b0a2cc41579fdb306af0",
//             "productId": "63c1b096cc41579fdb306422",
//             "url": "https://res.cloudinary.com/dapxj4quf/assets/jbl_reflcont2_blk_1_large.jpg",
//             "alt": "JBL - Reflect Contour 2 - Audio46"
//           }
//         ],
//         "variants": [
//           {
//             "id": "63c1b09ccc41579fdb30668d",
//             "productId": "63c1b096cc41579fdb306422",
//             "quantity": 2,
//             "sku": "JBLREFCONTOUR2GRN",
//             "barcode": "050036343619",
//             "options": "Color,Green"
//           }
//         ]
//       }
//     ]
//   }
// }