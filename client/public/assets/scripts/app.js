document.addEventListener('DOMContentLoaded', e => {
    const headerGlobal = document.querySelector('#header-global');
    const homeSecCat = document.querySelector('#home-section-cat');
    const homeSecLat = document.querySelector('#home-section-latest');
    const filterCatOutput = document.querySelector('#filter-cat-out')

    let user = localStorage.getItem('user');
    let token = localStorage.getItem('token');

    if (user && token) {
        headerGlobal.innerHTML =
            `
        <nav class="nav-global">
        <div class="flex justify-between">
        <div class="nav-blobal__logo">
        <a href="/">Webshop</a>
        </div>
        <div  class="nav-blobal__links">
                    <ul class="flex">
                    <li><a href="/">Home</a></li>
                        <li class="nav-dropdown-container">
                        <a href="/products">
                        Products<i class="fas fa-chevron-down"></i>
                            </a>
    	                    <ul class="nav-dropdown" id="navCatOutput">

                            </ul>
                            </li>
                            <li><a href="/profile">Profile</a></li>
                        <li><a id="logout" href="/">Logout</a></li>
                        <li><a href="/cart"><i class="fas fa-shopping-cart"></i></a></li>
                        </ul>
                </div>
                </div>
                </nav>
                `

        let logoutBtn = document.querySelector('#logout');
        logoutBtn.addEventListener('click', e => {
            e.preventDefault();

            localStorage.removeItem('user')
            localStorage.removeItem('token')

            window.location.href = 'http://localhost:5050/'
        })
    } else {
        headerGlobal.innerHTML =
            `
        <nav class="nav-global">
        <div class="flex justify-between">
        <div class="nav-blobal__logo">
        <a href="/">Webshop</a>
        </div>
        <div  class="nav-blobal__links">
        <ul class="flex">
        <li><a href="/">Home</a></li>
        <li class="nav-dropdown-container">
        <a href="/products">
        Products<i class="fas fa-chevron-down"></i>
        </a>
        <ul class="nav-dropdown" id="navCatOutput">
                        
        </ul>
        </li>
        <li><a href="/login">Login</a></li>
        <li><a href="/register">Register</a></li>
        <li><a href="/cart"><i class="fas fa-shopping-cart"></i></a></li>
        </ul>
        </div>
        </div>
        </nav>
        `
    }


    fetch('http://localhost:5000/categories')
        .then(res => res.json())
        .then(data => {

            const navCatOutput = document.querySelector('#navCatOutput');
            data.forEach(category => {
                navCatOutput.innerHTML +=
                    `
                        <li><a href="">${category.categoryName}</a></li>
                    `
                if (window.location.pathname == '/') {
                    homeSecCat.innerHTML +=
                        `
                    <li>
                        <a class="category-item" href="">
                            <img src="http://localhost:5000/${category.categoryIcon}" width="128" height="128"  />
                            <h3>${category.categoryName}</h3>
                        </a>
                    </li>
                `
                } else if (window.location.pathname === '/products') {
                    filterCatOutput.innerHTML +=
                        `
                <div class="filter-cat-item" >
                    <label>
                        <input type="radio" name="category" value="${category.categoryId}"> ${category.categoryName}
                    </label>
                </div>
                `
                }
            });
        })
        .catch(err => console.log(err))

    if (window.location.pathname == '/') {

        fetch('http://localhost:5000/products/latest')
            .then(res => res.json())
            .then(data => {
                data.forEach(product => {
                    homeSecLat.innerHTML +=
                        `
                <li>
                    <a class="product-item flex flex-col" href="">
                        <img src="http://localhost:5000/${product.images[0]}" width="100%" height="auto"  />
                        <div class="product-desc">
                            <h3 class="title">${product.name}</h3>
                            <p class="brand">${product.brand}</p>
                            <p class="price">${product.price} dkk</p>
                            <p class="quantity">Availability: ${product.quantity}</p>
                        </div>
                    </a>
                </li>
            `

                })
            })
            .catch(err => console.log(err))


    }

    if(window.location.pathname === '/products'){
        const productsOutput = document.querySelector('#prodsOutput');

        fetch('http://localhost:5000/products/', {method: 'GET'})
        .then(res => res.json())
        .then(data=> {
            data.data.forEach(product => {
                productsOutput.innerHTML += 
                `
                <li>
                    <a class="product-item flex flex-col" href="products/${product.id}">
                        <div style="background-image: url('http://localhost:5000/${product.images[0]}')" class="background background-contain"></div>
                        
                        <div class="product-desc">
                            <h3 class="title">${product.name}</h3>
                            <p class="brand">${product.brand}</p>
                            <p class="price">${product.price} dkk</p>
                            <p class="quantity">Availability: ${product.quantity}</p>
                        </div>
                    </a>
                </li>
                `
            })
        })
    }

    // if(window.location.pathname == '/products' || window.location.pathname.indexOf('/products?category=')){
    //     const filters = document.forms.filters;

    //     filters.addEventListener('submit', e => {
    //         e.preventDefault();
    //         let formData = new FormData(e.target)


    //         let reqInit = {
    //             method: 'GET',
    //             payload: formData
    //         }

    //         let request = new Request('http://localhost:5051/products', reqInit)

    //         fetch(request)
    //         .then(res => res.json())
    //         .then(data => console.log(data))
    //         .catch(err => console.log(err))
    //     })
    // }

    if (window.location.pathname === '/register') {

        let registerForm = document.forms.register;
        registerForm.addEventListener('submit', e => {
            e.preventDefault();

            let formData = new FormData(e.target)
            let reqInit = {
                method: 'POST',
                body: formData
            }

            fetch('http://localhost:5000/auth/register', reqInit)
                .then(res => res.json())
                .then(res => {
                    if (res.message === "Email is taken") {
                        alert('Email is taken!')
                    } else if (res.message === "Enter a password") {
                        alert('Input a password!')
                    } else if (res.message === "Password does not match") {
                        alert('Password and Confirm password do not match!')
                    } else if (res.message === "Registration successful") {
                        if (res.user && res.token) {
                            localStorage.setItem('user', JSON.stringify(res.user));
                            localStorage.setItem('token', JSON.stringify(res.token));
                        }
                        window.location.href = 'http://localhost:5050/'
                    }
                })
                .catch(err => console.log(err))

        })
    }

    if (window.location.pathname === '/login') {

        let loginForm = document.forms.login;
        loginForm.addEventListener('submit', e => {
            e.preventDefault();

            let formData = new FormData(e.target)
            let reqInit = {
                method: 'POST',
                body: formData
            }

            fetch('http://localhost:5000/auth/login', reqInit)
                .then(res => res.json())
                .then(res => {
                    if (res.message === "Wrong credentials") {
                        alert('Wrong credentials')
                        setTimeout(
                            () => {
                                window.location.href = 'http://localhost:5050/login'
                            }, 100
                        )
                    }

                    if (res.user && res.token) {
                        localStorage.setItem('user', JSON.stringify(res.user));
                        localStorage.setItem('token', JSON.stringify(res.token));
                        window.location.href = 'http://localhost:5050/'
                    }

                })
                .catch(err => console.log(err))

        })
    }
})