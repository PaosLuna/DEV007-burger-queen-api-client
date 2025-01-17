import { useEffect, useState } from "react";
import "../Comanda/comanda.css";
import { showAlertError } from "../../alert/alerts";
import { peticionPostOrders } from "../../servicios/servicios";


function Comanda({
  onMount,
  order,
  onAddProduct,
  onLessProduct,
  onDeleteItem,
  onResetOrder,
}) {
  useEffect(() => {
    onMount();
  }, []);

  // Calcula el total de los productos en la orden
  const totalCuenta = order.productos.reduce(
    (suma, producto) => suma + producto.quantity * producto.price,
    0
  );

  function addProduct(product) {
    onAddProduct(product);
  }

  function lessProduct(product) {
    onLessProduct(product);
  }

  //guarda el nombre del cliente
  const [client, setClient] = useState(""); //declaramos el estado del nombre del cliente

  const handleClient = (event) => {
    const nombreCliente = event.target.value;
    if (nombreCliente) {
      setClient(nombreCliente);
    }
  };

  //guarda el pedido
  function PostOrders() {
    // const bearerToken = localStorage.getItem("token");
    if (!client) {
      showAlertError("Por favor ingrese el nombre del cliente");
      return;
    }
    if (order.productos.length < 1) {
      showAlertError("Por favor seleccione un producto");
      return;
    }
    peticionPostOrders(client, order)
    .then((responseJson) => {
      localStorage.removeItem("order");
      onResetOrder();
      setClient("");
    })
  }

  return (
    <div className="container-principal">
      <div className="container-order">
        <h1 className="orden-pedido">PEDIDOS</h1>
        <input
          className="cliente"
          placeholder="NOMBRE CLIENTE"
          value={client}
          onChange={handleClient}
        ></input>
        <div className="container-pedido">
          <p className="info-producto">PRODUCTO</p>
          <p className="info-precio">PRECIO</p>
          <p className="info-cantidad">CANTIDAD</p>
        </div>
        <div className="lista-productos">
          {order.productos.map((producto, index) => (
            <div className="container-lista" key={index}>
              <div className="nombre">
                <p className="listaComida">{producto.name}</p>
              </div>
              <div className="container-precio">
                <p className="precio">${producto.price}</p>{" "}
                {/* usar P sólo cuando sean párrafos */}
              </div>
              <div className="botonesCantidad">
                <button className="mas" onClick={() => addProduct(producto)}>
                  +
                </button>
                <p className="suma-cantidad">{producto.quantity}</p>
                <button
                  className="menos"
                  onClick={() => lessProduct(producto.id)}
                  aria-label="Restar un XXX"
                >
                  -
                </button>
                <button
                  className="eliminar"
                  onClick={() => onDeleteItem(index)}
                >
                  <span className="icono-basura">&#10060;</span>
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="container-total">
          <p className="info-pedidos">TOTAL</p>
          <div className="info-total">
            <p className="suma-precio">${totalCuenta}</p>
          </div>
          <button className="boton-orden" onClick={PostOrders}>
            CREAR ORDEN
          </button>
        </div>
      </div>
    </div>
  );
}

export default Comanda;
