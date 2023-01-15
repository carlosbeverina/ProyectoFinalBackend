# Proyecto Final Carlos Beverina

El proyecto se encuentra cumpliendo con todas las especificaciones de la rubrica de evaluación y con los requerimientos de la user story

## Registro y Logueo
Cuando se inicia la aplicación se es redirigido a la pantalla de login en caso de tener un usuario se puede loguear.

En caso de necesitar registrar un usuario en la pagina se encuentra un link para el registro.

Para registrarse los campos necesarios se encuentran definidos en el formulario que cuenta con validacion de coincidencia de passwords.

## Proceso de compra
Una vez que ingresamos con un usuario y contraseña se puede seleccionar un producto desde la pagina y el mismo sera agregado al carrito de compra.

Para agregar y modificar productos no se tiene una interfaz grafica pero las rutas estan implementadas.

Una vez seleccionados los productos se debe hacer click en el link de "Cart" para visualizar el carrtio y sus productos.

Se pueden eliminar productos del carrito presionando el boton de eliminar al costado de cada uno.

Al hacer click en el boton de enviar pedido la orden se asienta en la DB y se envia un correo al admin con un detalle del pedido.