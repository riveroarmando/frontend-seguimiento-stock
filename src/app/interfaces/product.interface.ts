export interface Product {
    nombre_producto: string;
}

export interface ProductsResult {
    cliente:  string;
    producto: string;
    imagenes: string;
    hojas:    string;
}

export interface ProductsSearch {
    cliente:  string;
    producto: string;
    fecha_inicio: string;
    fecha_fin:    string;
    tipo: string;
    formato: string;
}

