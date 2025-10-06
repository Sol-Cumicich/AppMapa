import { createPage } from "../pages/utils.js";

export function crearListadoUsuarios(usuarios, filtroActivo = "Todos", qActual = "") {
  const filtros = ["Todos", "Con favoritos", "Sin favoritos"];

  let html = `
    <div class="container py-4">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h1 class="h3 m-0">Usuarios</h1>
        <a class="btn btn-success btn-sm" href="/usuarios/nuevo">Nuevo usuario</a>
      </div>

      <form class="input-group mb-3" action="/usuarios" method="get">
        <input type="text" class="form-control" name="nombreContiene" placeholder="Buscar por nombre..." value="${qActual || ""}">
        <button class="btn btn-outline-primary" type="submit">Buscar</button>
      </form>

      <div class="btn-group flex-wrap mb-3" role="group" aria-label="Filtros">
        ${filtros.map(f => {
          const active = (filtroActivo || "Todos") === f;
          const href = f === "Todos" ? "/usuarios" : `/usuarios?filtro=${encodeURIComponent(f)}`;
          const cls = active ? "btn btn-primary btn-sm" : "btn btn-outline-secondary btn-sm";
          return `<a class="${cls} me-2 mb-2" href="${href}">${f}</a>`;
        }).join("")}
      </div>

      <ul class="list-group">
        ${usuarios.map(u => {
          const favs = Array.isArray(u?.lugares_favoritos) ? u.lugares_favoritos : [];
          const favCount = favs.length;

          const rawId = (u && u._id && (u._id.toHexString?.() || u._id.toString?.())) || String(u?._id || "");
          const id = encodeURIComponent(rawId);

          return `
            <li class="list-group-item d-flex justify-content-between align-items-start">
              <div class="d-flex align-items-center">
                <img src="${u?.foto ?? ""}" alt="${u?.nombre ?? ""}" class="rounded me-3" style="width: 50px; height: 50px; object-fit: cover;">
                <div>
                  <div class="fw-semibold">${u?.nombre ?? ""}</div>
                  <small class="text-muted">${u?.descripcion ?? ""}</small><br>
                  <small class="text-${favCount > 0 ? "success" : "secondary"}">
                    ${favCount > 0 ? `${favCount} favoritos` : "Sin favoritos"}
                  </small>
                </div>
              </div>
              <div class="btn-group btn-group-sm">
                <a class="btn btn-outline-primary" href="/usuarios/${id}">Ver</a>
                <a class="btn btn-outline-warning" href="/usuarios/modificar/${id}">Editar</a>
                <a class="btn btn-outline-danger" href="/usuarios/eliminar/${id}">Eliminar</a>
              </div>
            </li>`;
        }).join("")}
      </ul>
    </div>
  `;

  return createPage("Usuarios", html, { active: "usuarios" });
}

export function crearDetalleUsuario(usuario) {
  let html = "";
  if (usuario) {
    const favs = Array.isArray(usuario.lugares_favoritos) ? usuario.lugares_favoritos : [];
    html += `
    <div class="container py-4">
      <div class="card shadow-sm">
        <div class="card-body">
          <h1 class="h4 mb-3">${usuario.nombre}</h1>
          <img src="${usuario.foto}" alt="${usuario.nombre}" class="img-fluid rounded mb-3" style="max-height:200px; object-fit:cover;">
          <p>${usuario.descripcion}</p>
          ${favs.length > 0
            ? `<p><strong>Lugares Favoritos:</strong> ${favs.map(p => p?.nombre || "").join(", ")}</p>`
            : `<p class="text-muted">Sin favoritos</p>`}
          <a href="/usuarios" class="btn btn-secondary btn-sm">Volver</a>
        </div>
      </div>
    </div>`;
    return createPage(usuario.nombre, html);
  } else {
    return createPage("Error", "<div class='container py-4'><div class='alert alert-danger'>Usuario no encontrado</div></div>");
  }
}

export function formularioNuevoUsuario() {
  let html = `
  <div class="container py-4">
    <h1 class="h4 mb-3">Nuevo Usuario</h1>
    <form action='/usuarios/nuevo' method='post' class="card card-body shadow-sm">
      <div class="mb-3"><input type='text' class="form-control" placeholder='Nombre' name='nombre' /></div>
      <div class="mb-3"><input type='text' class="form-control" placeholder='Foto (URL)' name='foto' /></div>
      <div class="mb-3"><textarea class="form-control" placeholder='Descripción' name='descripcion'></textarea></div>
      <button type="submit" class="btn btn-success">Guardar</button>
      <a href="/usuarios" class="btn btn-secondary ms-2">Volver</a>
    </form>
  </div>`;
  return createPage("Nuevo Usuario", html);
}

export function formularioModificarUsuario(usuario) {
  let html = `
  <div class="container py-4">
    <h1 class="h4 mb-3">Modificar Usuario</h1>
    <form action='/usuarios/modificar/${usuario._id}' method='post' class="card card-body shadow-sm">
      <div class="mb-3"><input type='text' class="form-control" placeholder='Nombre' name='nombre' value="${usuario.nombre}" /></div>
      <div class="mb-3"><input type='text' class="form-control" placeholder='Foto (URL)' name='foto' value="${usuario.foto}" /></div>
      <div class="mb-3"><textarea class="form-control" placeholder='Descripción' name='descripcion'>${usuario.descripcion}</textarea></div>
      <button type="submit" class="btn btn-primary">Guardar cambios</button>
      <a href="/usuarios" class="btn btn-secondary ms-2">Volver</a>
    </form>
  </div>`;
  return createPage("Modificar Usuario", html);
}

export function formularioEliminarUsuario(usuario){
  let html = `
  <div class="container py-4">
    <h1 class="h4 mb-3">Eliminar Usuario</h1>
    <form action='/usuarios/eliminar/${usuario._id}' method='post' class="card card-body shadow-sm">
      <p><strong>Nombre:</strong> ${usuario.nombre}</p>
      <img src="${usuario.foto}" alt="${usuario.nombre}" class="img-fluid rounded mb-3" style="max-height:200px; object-fit:cover;">
      <p>${usuario.descripcion}</p>
      <button type="submit" class="btn btn-danger">Eliminar</button>
      <a href="/usuarios" class="btn btn-secondary ms-2">Volver</a>
    </form>
  </div>`;
  return createPage("Eliminar Usuario", html);
}

export function eliminacionExito(_id){
  let html = "";
  if (_id) {
    html += `
    <div class="container py-4">
      <div class="card shadow-sm">
        <div class="card-body">
          <h1 class="h5 mb-3">El usuario con id <span class="text-primary">${_id}</span></h1>
          <p class="mb-3">Ha sido eliminado correctamente.</p>
          <a href="/usuarios" class="btn btn-secondary">Volver</a>
        </div>
      </div>
    </div>`;
    return createPage("Eliminado", html);
  } else {
    return createPage("Error", "<div class='container py-4'><div class='alert alert-danger'>Usuario no encontrado</div></div>");
  }
}
