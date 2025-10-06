import { createPage } from "../pages/utils.js";

export function crearListadoPuntos(puntos, categoriaActiva = "", qActual = "") {
  const categorias = ["Todos", "Curiosos", "Populares", "Gastronómicos", "Espacios Verdes", "Culturales"];

  let html = `
    <div class="container py-4">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h1 class="h3 m-0">Puntos Visitables</h1>
        <a class="btn btn-success btn-sm" href="/puntos/nuevo">Nuevo punto</a>
      </div>

      <form class="input-group mb-3" action="/puntos" method="get">
        <input type="text" class="form-control" name="nombreContiene" placeholder="Buscar por nombre..." value="${qActual || ""}">
        <button class="btn btn-outline-primary" type="submit">Buscar</button>
      </form>

      <div class="btn-group flex-wrap mb-3" role="group" aria-label="Categorías">
        ${categorias.map(cat => {
          const active = (categoriaActiva || "Todos") === cat;
          const href = cat === "Todos" ? "/puntos" : `/puntos?categoria=${encodeURIComponent(cat)}`;
          const cls = active ? "btn btn-primary btn-sm" : "btn btn-outline-secondary btn-sm";
          return `<a class="${cls} me-2 mb-2" href="${href}">${cat}</a>`;
        }).join("")}
      </div>

      <ul class="list-group">
        ${puntos.map(p => {
          const rawId = (p && p._id && (p._id.toHexString?.() || p._id.toString?.())) || String(p?._id || "");
          const id = encodeURIComponent(rawId);

          return `
            <li class="list-group-item d-flex justify-content-between align-items-start">
              <div class="me-3">
                <div class="fw-semibold">${p?.nombre ?? ""}</div>
                <small class="text-muted">${p?.categoria ?? ""}</small>
              </div>
              <div class="btn-group btn-group-sm">
                <a class="btn btn-outline-primary" href="/puntos/${id}">Ver</a>
                <a class="btn btn-outline-warning" href="/puntos/modificar/${id}">Editar</a>
                <a class="btn btn-outline-danger" href="/puntos/eliminar/${id}">Eliminar</a>
              </div>
            </li>`;
        }).join("")}
      </ul>
    </div>
  `;

  return createPage("Puntos Visitables", html, { active: "puntos" });
}

export function crearDetallePunto(punto) {
  let html = "";
  if (punto) {
    html += `
    <div class="container py-4">
      <div class="card">
        <div class="card-body">
          <h1 class="h4 mb-3">${punto.nombre}</h1>
          <img src="${punto.foto}" alt="${punto.nombre}" class="img-fluid rounded mb-3" style="max-height:200px; object-fit:cover;">
          <p><strong>Categoría:</strong> ${punto.categoria}</p>
          <p><strong>Dirección:</strong> ${punto.direccion}</p>
          <p>${punto.descripcion}</p>
          <p><a href="${punto.link}" target="_blank" class="btn btn-sm btn-outline-info">Más información</a></p>
          <a href="/puntos" class="btn btn-secondary btn-sm">Volver</a>
        </div>
      </div>
    </div>`;
    return createPage(punto.nombre, html);
  } else {
    return createPage("Error", "<div class='container py-4'><div class='alert alert-danger'>Punto no encontrado</div></div>");
  }
}

export function formularioNuevoPunto() {
  let html = `
  <div class="container py-4">
    <h1 class="h4 mb-3">Nuevo Punto</h1>
    <form action='/puntos/nuevo' method='post' class="card card-body shadow-sm">
      <div class="mb-3"><input type='text' class="form-control" placeholder='Nombre del punto' name='nombre' /></div>
      <div class="mb-3"><input type='text' class="form-control" placeholder='Categoría' name='categoria' /></div>
      <div class="mb-3"><input type='text' class="form-control" placeholder='Dirección' name='direccion' /></div>
      <div class="mb-3"><input type='text' class="form-control" placeholder='Foto (URL)' name='foto' /></div>
      <div class="mb-3"><textarea class="form-control" placeholder='Descripción' name='descripcion'></textarea></div>
      <div class="mb-3"><input type='text' class="form-control" placeholder='Link' name='link' /></div>
      <button type="submit" class="btn btn-success">Guardar</button>
      <a href="/puntos" class="btn btn-secondary ms-2">Volver</a>
    </form>
  </div>`;
  return createPage("Nuevo Punto", html);
}

export function formularioModificarPunto(punto) {
  let html = `
  <div class="container py-4">
    <h1 class="h4 mb-3">Modificar Punto</h1>
    <form action='/puntos/modificar/${punto._id}' method='post' class="card card-body shadow-sm">
      <div class="mb-3"><input type='text' class="form-control" placeholder='Nombre del punto' name='nombre' value="${punto.nombre}" /></div>
      <div class="mb-3"><input type='text' class="form-control" placeholder='Categoría' name='categoria' value="${punto.categoria}" /></div>
      <div class="mb-3"><input type='text' class="form-control" placeholder='Dirección' name='direccion' value="${punto.direccion}" /></div>
      <div class="mb-3"><input type='text' class="form-control" placeholder='Foto (URL)' name='foto' value="${punto.foto}" /></div>
      <div class="mb-3"><textarea class="form-control" placeholder='Descripción' name='descripcion'>${punto.descripcion}</textarea></div>
      <div class="mb-3"><input type='text' class="form-control" placeholder='Link' name='link' value="${punto.link}" /></div>
      <button type="submit" class="btn btn-primary">Guardar cambios</button>
      <a href="/puntos" class="btn btn-secondary ms-2">Volver</a>
    </form>
  </div>`;
  return createPage("Modificar Punto", html);
}

export function formularioEliminar(punto){
  let html = `
  <div class="container py-4">
    <h1 class="h4 mb-3">Eliminar Punto</h1>
    <form action='/puntos/eliminar/${punto._id}' method='post' class="card card-body shadow-sm">
      <p><strong>Nombre:</strong> ${punto.nombre}</p>
      <img src="${punto.foto}" alt="${punto.nombre}" class="img-fluid rounded mb-3" style="max-height:200px; object-fit:cover;">
      <p><strong>Categoría:</strong> ${punto.categoria}</p>
      <p><strong>Dirección:</strong> ${punto.direccion}</p>
      <p>${punto.descripcion}</p>
      <button type="submit" class="btn btn-danger">Eliminar</button>
      <a href="/puntos" class="btn btn-secondary ms-2">Volver</a>
    </form>
  </div>`;
  
  return createPage("Eliminar Punto", html);
}

export function eliminacionExito(_id){
  let html = "";
  if (_id) {
    html += `
    <div class="container py-4">
      <div class="alert alert-success">
        <h1 class="h5">El punto con Id: ${_id}</h1>
        <p>Ha sido eliminado correctamente</p>
        <a href="/puntos" class="btn btn-secondary btn-sm">Volver</a>
      </div>
    </div>`;
    return createPage("Eliminado", html);
  } else {
    return createPage("Error", "<div class='container py-4'><div class='alert alert-danger'>Punto no encontrado</div></div>");
  }
}
