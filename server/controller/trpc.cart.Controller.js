import { z } from "zod";
import { userProcedure } from "../utils/trpc.js";
import cartAdapter from "../model/cart.js";
import prisma from "../utils/connectDB.js";



const addToCart = userProcedure
.input(z.object({
    variantId: z.string(),
    userId: z.string(),
    productId: z.string(),
}))
.mutation(async ({ input }) => {
    let status = await cartAdapter(prisma).addToCart(input)
    return {
        status
    }
})

const getCartItem = userProcedure.query(async ({ ctx }) => {
    if (ctx.error) return ctx.errorMessage;
    let data = await cartAdapter(prisma).getItems(ctx.req.user )
    return data
})

const updateCart = ""

const deleteCart = ""

export { addToCart , getCartItem, updateCart, deleteCart };

// model CartItem {
//     id        String   @id @default(auto()) @map("_id") @db.ObjectId
//     productId String   @db.ObjectId
//     quantity  Int
//     createdAt DateTime @default(now())
//     userId    String   @db.ObjectId
//     User      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
//     @@unique([productId, userId])
//   }

// Data Sample
// "data": {
//   "id": "63c1b096cc41579fdb30641d",
//   "title": "Sony MDR-ZX110AP Extra Bass On Ear Headphones with Mic",
//   "description": "&lt;h3 class=&quot;a-spacing-mini&quot;&gt;Extra Bass Smartphone Headset with Mic&lt;/h3&gt;\n&lt;h4 class=&quot;a-spacing-mini a-color-secondary a-text-italic&quot;&gt;Smartphone connectivity, impressive bass&lt;/h4&gt;\n&lt;p class=&quot;a-spacing-base&quot;&gt;Form meets function with smartphone control for life on the go. More than your basic pair of over-the-head headphones, the Sony MDR-ZX110AP headset delivers rock-solid audio performance, integrated microphone for hands-free calling, and media playback controls for convenient operation.&lt;/p&gt;",
//   "price": 21,
//   "list_price": 24,
//   "discount": 15,
//   "type": "Headphones",
//   "quantity_total": 4,
//   "brand": "Sony",
//   "createdAt": "2023-01-13T19:27:18.445Z",
//   "updatedAt": "2023-01-13T19:27:18.445Z",
//   "images": [
//     {
//       "id": "63c1b0a2cc41579fdb306ad7",
//       "productId": "63c1b096cc41579fdb30641d",
//       "url": "https://res.cloudinary.com/dapxj4quf/assets/mdrzx110ap_large.jpg",
//       "alt": ""
//     },
//     {
//       "id": "63c1b0a2cc41579fdb306ad9",
//       "productId": "63c1b096cc41579fdb30641d",
//       "url": "https://res.cloudinary.com/dapxj4quf/assets/mdrzx110-folded_large.jpg",
//       "alt": ""
//     }
//   ],
//   "variants": [
//     {
//       "id": "63c1b09ccc41579fdb306681",
//       "productId": "63c1b096cc41579fdb30641d",
//       "quantity": 4,
//       "sku": "mdrzx110ap",
//       "barcode": "027242879416",
//       "options": "Title,Default Title"
//     }
//   ]
// }
