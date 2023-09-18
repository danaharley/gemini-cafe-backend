import cartItemModel from "../cart-item/cartItem.model.js";
import productModel from "../product/product.model.js";

export const getCart = async (req, res, next) => {
  try {
    const items = await cartItemModel
      .find({ user: res.locals.user._id })
      .populate("products");

    return res.status(200).json(items);
  } catch (error) {
    if (error && error.name == "ValidationError") {
      return res.json({
        fields: error.errors,
      });
    }

    next(err);
  }
};

export const update = async (req, res, next) => {
  try {
    const { items } = req.body;

    if (!items.length) res.status(400).json("Oops! Your Cart is Empty!");

    const productIds = items.map((item) => item._id);

    const products = await productModel.find({ _id: { $in: productIds } });

    const cartItems = items.map((item) => {
      const relatedProduct = products.find(
        (product) => product._id.toString() === item._id
      );

      return {
        product: relatedProduct._id,
        price: relatedProduct.price,
        image: relatedProduct.image,
        name: relatedProduct.name,
        qty: item.qty,
        user: res.locals.user._id,
      };
    });

    await cartItemModel.bulkWrite(
      cartItems.map((item) => {
        return {
          updateOne: {
            filter: { user: res.locals.user._id, products: item.product },
            update: item,
            upsert: true,
          },
        };
      })
    );

    return res.status(200).json(cartItems);
  } catch (error) {
    if (error && error.name === "ValidationError") {
      return res.status(400).json({
        fields: error.errors,
      });
    }

    next(error);
  }
};
