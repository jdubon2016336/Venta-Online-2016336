"user strict";
var Cart = require("../models/cart.model");
var Product = require("../models/product.model");

function addProductToCart(req, res) {
    var idUser = req.userClient.sub;
    var params = req.body;

    if (req.userClient.rol == "CLIENT") {
        if (params.name && params.quantity) {
            Cart.findOne({ user: idUser }).exec((err, cartFind) => {
                if (err) return res.status(200).send({ message: "Error en el servidor" });
                if (cartFind) {
                    cartId = cartFind._id;
                    Product.findOne({ name: params.name }).exec((err, productFind) => {
                        if (err) return res.status(200).send({ message: "Error en el servidor" });
                        if (productFind) {
                            if (productFind.quantity == 0) {
                                return res.status(200).send({
                                    message: "No hay articulos disponibles en este momento",
                                });
                            } else {
                                Cart.findByIdAndUpdate(
                                    cartId,
                                    {
                                        $push: {
                                            products: {
                                                product: productFind._id,
                                                name: params.name,
                                                quantity: params.quantity,
                                                price: productFind.price,
                                            },
                                        },
                                    },
                                    { new: true },
                                    (err, productAdd) => {
                                        if (err) return res.status(200).send({ message: "Error en el servidor" });

                                        if (productAdd) {
                                            var totalCart = parseInt(cartFind.total) + parseInt(productFind.price) * parseInt(params.quantity);

                                            Cart.findByIdAndUpdate(cartId, { $set: { total: totalCart } }, { new: true }, (err, finalTotal) => {
                                                if (err) return res.status(200).send({ message: "Error en el servidor" });

                                                if (finalTotal) {
                                                    return res.status(200).send({
                                                        message: "Producto agregado al carrito correctamente",
                                                        Total: finalTotal.total,
                                                    });
                                                } else {
                                                    return res.status(200).send({ message: "No se pudo agregar el total" });
                                                }
                                            });
                                        } else {
                                            return res.status(200).send({
                                                message: "No se pudo agregar el producto al carrito",
                                            });
                                        }
                                    }
                                );
                            }
                        } else {
                            return res.status(200).send({ message: "No se encontro el producto" });
                        }
                    });
                } else {
                    return res.status(200).send({ message: "Error de login" });
                }
            });
        } else {
            return res.status(200).send({ message: "Ingrese todos los paramentros" });
        }
    } else {
        return res.status(200).send({
            message: "Usted es administrador y no puede agregar productos al carrito",
        });
    }
}

module.exports = {
    addProductToCart,
};
