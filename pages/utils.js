export function createPage(title, content){
    let html = "";

    html  = '<!DOCTYPE html><html><head><meta charset="UTF-8">';
    html += '<meta name="viewport" content="width=device-width, initial-scale=1">';
    html += '<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">';
    html += '<link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" rel="stylesheet">';
    html += '<link rel="stylesheet" href="../public/style.css">';
    html += '<title>'+ title +'</title></head>';
    html += '<body class="d-flex flex-column min-vh-100 m-0">';
    html += `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container">
        <a class="navbar-brand fw-semibold me-3" href="/">Xendaria</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMain" aria-controls="navMain" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navMain">
        <ul class="navbar-nav ms-auto">
            <li class="nav-item"><a class="nav-link" href="/puntos">Puntos</a></li>
            <li class="nav-item"><a class="nav-link" href="/usuarios">Usuarios</a></li>
        </ul>
        </div>
    </div>
    </nav>`;
    html += `<main class="flex-grow-1">` + content + `</main>`;
    html += `
    <footer class="bg-dark text-light mt-auto w-100">
    <div class="container py-4 d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
        <span class="mb-0 small">&copy; 2025 Xendaria — Alexandra Rivero Sol Cumicich — DWN4AP</span>
        <div class="d-flex align-items-center gap-3">
        <a href="https://www.instagram.com/" target="_blank" rel="noopener" class="text-light text-decoration-none d-inline-flex align-items-center">
            <i class="bi bi-instagram fs-4" aria-hidden="true"></i>
            <span class="visually-hidden">Instagram</span>
        </a>
        <a href="https://www.tiktok.com/" target="_blank" rel="noopener" class="text-light text-decoration-none d-inline-flex align-items-center">
            <i class="bi bi-tiktok fs-4" aria-hidden="true"></i>
            <span class="visually-hidden">TikTok</span>
        </a>
        </div>
    </div>
    </footer>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>`;

    html += '</body></html>';
    return html;
}
