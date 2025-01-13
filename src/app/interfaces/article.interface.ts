export interface ArticleSearch {
    termino:  string;
    longitud_pagina:  number;
    numero_pagina:    number;
  }

export interface ArticleResponse {
    articulos:        Articulo[];
    cantidad_paginas: number;
    registro_inicio:  number;
    total_registros:  number;
    numero_pagina:    number;
    longitud_pagina:  number;
}

export interface Articulo {
    codigo:      string;
    descripcion: string;
    unidad:      string;
    cantidad:    number;
    proveedores: Proveedores[];
}

export interface Proveedores {
    nombre_proveedor: string;
}


export interface NewArticle {
    codigo:      string;
    descripcion: string;
    unidad:      string;
    proveedores: string[];
    cantidad:    number;
}

export interface ArticleUpdateInterface {
    descripcion: string;
    unidad:      string;
    proveedores: string[];
    cantidad:    number;
}
