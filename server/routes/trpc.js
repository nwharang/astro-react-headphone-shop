import { router } from "../utils/trpc.js";
import { productId, product, productSearch } from "../controller/trpc.product.Controller.js";
import { register, userInfo } from "../controller/trpc.user.Controller.js";
import { test } from "../controller/trpc.test.Controller.js";
import { addToCart, getCartItem, } from "../controller/trpc.cart.Controller.js";

const productRouter = router({
    all: product,
    productId: productId,
    productSearch: productSearch,
})

const userRouter = router({
    info: userInfo,
    register: register,
})
const cartRouter = router({
    add: addToCart,
    get: getCartItem,
    // update: deleteCart,
    // delete: updateCart
})

const appRouter = router({
    "": test,
    product: productRouter,
    user: userRouter,
    cart: cartRouter
})

export default appRouter
