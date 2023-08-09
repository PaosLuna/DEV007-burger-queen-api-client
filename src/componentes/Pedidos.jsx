import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../estilos/pedidos.css";
import Encabezado from "./Header";
//import PeticionGetOrders from "./PeticionGetOrders";

function Pedidos() {

  
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();


  useEffect(() => {
    const bearerToken = localStorage.getItem("token");
    if (!bearerToken) {
      navigate("/");
      return;
    }

    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + bearerToken,
      },
    };

    fetch("http://localhost:8080/orders", requestOptions)
      .then((response) => response.json())
      .then((responseJson) => {
        console.log('respuesta exitosa',responseJson)
        setOrders(responseJson);
      })
      .catch((error) => {
        console.error("error en la peticion", error);
      });
  },[]);
  
  
  return (
    <div className="container-pedidos">
      <div className="Encabezado">
        <Encabezado />
      </div>
      <div></div>
      <div className="titulo-pedidos">
        <h1 className="title">PEDIDOS</h1>
      </div>

      <div className="container-productos">
      <div className="container-orden">
        <p className="orden">Orden:</p>
      </div>

      <div className="header-comanda">
        <p className="info-producto">PRODUCTO</p>
        <p className="info-precio">CANTIDAD</p>
      </div>

      <div className="container-pedidos">
        {/* <p className="litapedidos">cafe</p>
        <p className="listacantidad">1</p> */}
     {orders.map((order, index) => (
          <div className="container-lista" key={index}>
            <div className="nombre">
            <p className="listaComida">{order.client}</p>
            </div>
            {order.products.map((producto) => (
              <div className="container-lista" key={index}>
              <div className="nombre">
              <p className="listaComida">{producto.name}</p>
              </div>
              <div className="container-precio">
              
              <p className="precio">{producto.price}</p>
              </div>
            </div>
            ))}
          </div>
        ))}
      </div>

      <div className="estado">
        <p>pendiente</p>
      </div>

      <div className="btnEstado">
        <button>ESTADO</button>
      </div>

      </div>

    </div>
  );
}

export default Pedidos;
