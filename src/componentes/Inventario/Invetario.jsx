import React, { useState, useEffect } from "react";
import {
  getProducts,
  editProduct,
  deleteProductRequest,
  AddProducts,
} from "../../servicios/servicios.js";
import { useNavigate } from "react-router-dom";
import Encabezado from "../Header/Header.jsx";
import "./inventarios.css";
import Modal from "../modal/Modal.jsx";
import EditarProductos from "./EditarProductos";
import AgregarProducto from "./AgregarProducto.jsx";
import { showAlertError } from "../../alert/alerts.js";

function Inventario() {
  const [products, setProductos] = useState([]);
  const navigate = useNavigate();
  const bearerToken = localStorage.getItem("token");
  const [AddProduct, setAddProduct] = useState(false);

  useEffect(() => {
    const bearerToken = localStorage.getItem("token");
    if (!bearerToken) {
      navigate("/");
      return;
    }
    getProducts().then((products) => {
      setProductos(products);
      console.log(products, 20);
    });
  }, []);

  /*-------------------------------------LÓGICA MODAL Y PETICIÓN PARA EDITAR PRODUCTOS -----------------------*/

  const [openModalId, setOpenModalId] = useState(null);

  //abre el modal
  const handleEditClick = (productId) => {
    setOpenModalId(productId);
  };

  //cierra el modal
  const handleCloseModal = () => {
    setOpenModalId(null);
  };

  //Ejecuta la petición y le pasa los parametros necesarios
  const handleEditProducts = (productId, newPrice) => {
    EditProducts(productId, newPrice);
    setOpenModalId(null);
  };

  //Ejecuta la peticion y le pasa los paramentros necesarios
  const handleAddProducts = (name, price, image, type) => {
    if (!name) {
      showAlertError("Ingrese el nombre del producto");
      return;
    }
    if (!price) {
      showAlertError("Ingrese el costo del producto");
      return;
    }
    if (!image) {
      showAlertError("Ingrese la imagen del producto");
      return;
    }
    if (!type || type == "ELIGE EL TIPO DE COMIDA") {
      showAlertError("selecione el tipo de comida");
      return;
    }
    const body = { name, price, image, type };
    const options = {
      onSuccess: () => {
        setAddProduct(false);
        getProducts().then((products) => {
          setProductos(products);
        });
      },
    };
    AddProducts(body, options, bearerToken);
    setOpenModalId(null);
  };

  /*------------------------------------- PETICIÓN PARA EDITAR PRODUCTOS --------------------------------------*/
  function EditProducts(productId, newPrice) {
    const options = {
      onSuccess: () => {
        setAddProduct(false);
        getProducts().then((products) => {
          setProductos(products);
        });
      },
    };
    editProduct(productId, newPrice, bearerToken, options);
  }

  /*------------------------------------- PETICIÓN PARA ELIMINAR PRODUCTOS --------------------------------------*/
  function DeleteProduct(productId) {
    const options = {
      onSuccess: () => {
        setAddProduct(false);
        getProducts().then((products) => {
          setProductos(products);
        });
      },
    };
    deleteProductRequest(productId, bearerToken, options);
  }

  return (
    <>
      <div className="container-inventario">
        <Encabezado />
        <div className="container-title-productos">
          <h1 className="title">PRODUCTOS</h1>
        </div>
        <div className="container-allproducts">
          <div className="info-products">
            <div className="title-id">
              <p>ID</p>
            </div>
            <div className="title-product">
              <p>PRODUCTO</p>
            </div>
            <div className="title-price">
              <p>PRECIO</p>
            </div>
            <div className="title-options">
              <p>OPCIONES</p>
            </div>
          </div>

          {products.map((product, index) => (
            <div
              className="container-listproducts"
              key={index}
              data-testid="product-container"
            >
              <p className="productId">{product.id}</p>
              <p className="productName">{product.name}</p>
              <p className="productPrice">{product.price}</p>
              <div className="button-option-product">
                <button
                  className="button-edit-product"
                  onClick={() => handleEditClick(product.id)}
                >
                  EDITAR
                </button>
                <Modal
                  isOpen={openModalId === product.id}
                  onClose={handleCloseModal}
                >
                  <EditarProductos
                    onSaveChanges={(newPrice) => {
                      handleEditProducts(product.id, newPrice);
                      handleCloseModal();
                    }}
                  />
                </Modal>
                <button
                  className="button-delete-product"
                  onClick={() => DeleteProduct(product.id)}
                >
                  ELIMINAR
                </button>
              </div>
            </div>
          ))}
        </div>
        <button className="add-product" onClick={() => setAddProduct(true)}>
          AGREGAR PRODUCTO
        </button>
        <Modal isOpen={AddProduct} onClose={() => setAddProduct(false)}>
          <AgregarProducto onSaveChanges={handleAddProducts} />
        </Modal>
      </div>
    </>
  );
}

export default Inventario;
