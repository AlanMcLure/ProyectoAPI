/*!
* Start Bootstrap - Scrolling Nav v5.0.6 (https://startbootstrap.com/template/scrolling-nav)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-scrolling-nav/blob/master/LICENSE)
*/
//
// Scripts
// 

// Variable para rastrear si el usuario ha iniciado sesión
let isLoggedIn = false;

function logout() {
    fetch("http://localhost:8080/calc/calcula?op=logout", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        // with credentials
        credentials: 'include'
    }).then(function (response) {
        if (response.status == 200) {
            console.log("Logout exitoso.");
            
            document.getElementById("login").value = "";
            document.getElementById("password").value = "";

            document.getElementById("a").value = "";
            document.getElementById("b").value = "";
            document.getElementById("c").value = "";
            document.getElementById("solucionesEcuacion").style.display = "none";

            document.getElementById("content").style.display = "none";
            document.getElementById("container-form").style.display = "block";
        } else {
            console.log("Error en el logout.");
        }
    }).catch(function (error) {
        console.log("Error en el logout:", error);
    });
}

// function checkSession() {
//     fetch("http://localhost:8080/calc/calcula?op=check", {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         // with credentials
//         credentials: 'include'
//     }).then(function (response) {
//         return response.json();
//     }).then(function (data) {
//         console.log("Check de sesión:", data);
//     }).catch(function (error) {
//         console.log("Error en el check de sesión:", error);
//     });
// }



        
function calcular() {
    let a = parseFloat(document.getElementById("a").value);
    let b = parseFloat(document.getElementById("b").value);
    let c = parseFloat(document.getElementById("c").value);

    document.getElementById("solucionesEcuacion").innerHTML = "";

    let equation = {
        "a": a,
        "b": b,
        "c": c
    }

    fetch("http://localhost:8080/calc/calcula?op=calcula", {
        method: 'POST',
        body: JSON.stringify(equation),
        headers: {
            'Content-Type': 'application/json'
        },
        // with credentials
        credentials: 'include'
    }).then(function (response) {
        return response.json();
    }).then(function (data) {
        // Construir la ecuación de segundo grado
        let equationString = `${a}x<sup>2</sup>`;
        if (b >= 0) {
            equationString += ` + ${b}x`;
        } else {
            equationString += ` - ${Math.abs(b)}x`;
        }
        if (c >= 0) {
            equationString += ` + ${c} = 0`;
        } else {
            equationString += ` - ${Math.abs(c)} = 0`;
        }

        // Mostrar las soluciones de la ecuación junto con la ecuación misma
        let resultString = `Ecuación: ${equationString}<br>Soluciones: ${data.resultado}`;
        document.getElementById("solucionesEcuacion").style.display = "block";
        document.getElementById("solucionesEcuacion").innerHTML = resultString;
        console.log(data);
    }).catch(function (error) {
        console.log(error);
    })
}


// create a function to login the server into http://localhost:8080/calc/calcula?op=login usin method POST and form values in body json
// Modifica la función login para que retorne una promesa
function login(callback) {
    let login = document.getElementById("login").value;
    let password = CryptoJS.SHA256(document.getElementById("password").value).toString();

    let user = {
        "username": login,
        "password": password
    };

    return fetch("http://localhost:8080/calc/calcula?op=login", {
        method: 'POST',
        body: JSON.stringify(user),
        headers: {
            'Content-Type': 'application/json'
        },
        // with credentials
        credentials: 'include'
    }).then(function (response) {
        if (response.status === 200) {
            isLoggedIn = true;
            return response.json();
        } else {
            document.getElementById("loginError").style.display = "block";
            throw new Error("Error en el inicio de sesión: KO");
        }
    }).then(function (data) {
        console.log("OK logueado", data);
        callback(data);
    });
}

window.addEventListener('load', event => {

    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            rootMargin: '0px 0px -40%',
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

    document.getElementById("loginForm").addEventListener("submit", function (event) {
        event.preventDefault();
        
        document.getElementById("loginError").style.display = "none";

        // Llama a la función login y maneja la promesa
        login(function (userData) {
            // Verifica si el inicio de sesión ha tenido éxito
            // Si es así, habilita la calculadora
            if (isLoggedIn) {
                document.getElementById("container-form").style.display = "none"; // Oculta el formulario de inicio de sesión
                document.getElementById("content").style.display = "block"; // Muestra el contenido
                const navbarUsername = document.getElementById("navbarUsername");
                navbarUsername.textContent = userData.username;
            }
        });
    });

    // Evento para el botón de "Logout"
    document.getElementById("logoutButton").addEventListener("click", function () {
        event.preventDefault();
        logout(); // Realiza el logout
    });



    // Por ejemplo, podrías configurar un evento para el formulario de la calculadora:
    document.getElementById("form_ecuacion_cuadratica").addEventListener("submit", function (event) {
        event.preventDefault();
        calcular(); // Llama a la función de cálculo cuando se envía el formulario de la calculadora.
    });

    // Otras configuraciones iniciales pueden ir aquí.

});
