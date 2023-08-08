import "../estilos/desayunos.css";
import Encabezado from "./Header";
import Menu from "./Menu";
import { useEffect, useState } from "react";
import { getRequestOptions } from "../servicios/getRequestOptions";
import Comanda from "./Comanda";

function Home() {
  const [productos, setProductos] = useState([]);
  const [order, setOrder] = useState({ productos: [] });


  const handleAddProduct = (product) => {
    if(!order.productos.includes(product)){
      product['quantity'] = 1;
      setOrder((prevOrder) => ({
        ...prevOrder,
        productos: [...prevOrder.productos, product],
      }));
    }else{
      plusProduct(product.id)
    }
    
  };

  const handleComandaMount = () => {
    if (!order.productos.length) {
      console.log(localStorage.getItem("order"));
      const localStorageOrder = JSON.parse(localStorage.getItem("order"));
      if (localStorageOrder) {
        setOrder(localStorageOrder);
      }
    }
  };


  const plusProduct = (productId) => {
   const newOrderProducts = order.productos.map(function(product){
    if(product.id == productId){
      product.quantity += 1;
      return product
    }else{
      return product
    }
  });
   setOrder({ productos: newOrderProducts });
  };


  const lessProduct = (productId) => {
    const newOrderProducts = order.productos.map(function(product){
     if(product.id == productId){
       product.quantity -= 1;
       return product
     }else{
       return product
     }
   });
    setOrder({ productos: newOrderProducts });
   };


  /* PETICIÓN A LA API PARA MOSTRAR LOS OBJETOS EN LA INTERFAZ */
  useEffect(() => {
    fetch("http://localhost:8080/products", getRequestOptions("GET"))
      .then((response) => response.json())
      .then((responseJson) => {
        setProductos(responseJson);
      })
      .catch((error) => {
        console.error(error.mensaje);
      });
  }, []);

  useEffect(() => {
    if (order.productos.length) {
      localStorage.setItem("order", JSON.stringify(order));
    }
  }, [order]);

  return (
    <>
      <Encabezado />
      <Menu productos={productos} onAddProduct={handleAddProduct} />
      <Comanda order={order} onMount={handleComandaMount} onAddProduct={handleAddProduct} onLessProduct={lessProduct} />
    </>
  );
}

export default Home;
