const app = {
    data: {
        products: [],
    },
    getData() {
        axios.get(`${api_base_url}/api/${api_path}/admin/products?page=:page`)
            .then(res => {
                this.data.products = res.data.products;
                this.render();
            })
    },
    render() {
        // DOM
        const productList = document.querySelector("#productList");
        const productCount = document.querySelector("#productCount");

        // 產品數量
        productCount.innerHTML = this.data.products.length;
        // 產品列表渲染
        // 如果產品清單無資料
        if (!this.data.products.length) {
            productList.innerHTML = `<tr><td colspan="5">無產品資料</td></tr>`;
            return
        }

        let templateHTML = this.data.products.reduce((acc, item) =>
            acc + `<tr>
            <td>${item.title}</td>
            <td width="120">
                ${item.origin_price}
            </td>
            <td width="120">
                ${item.price}
            </td>
            <td width="100">
                <span class="">${item.is_enabled}</span>
            </td>
            <td width="120">
                <button type="button" class="btn btn-sm btn-outline-danger move deleteBtn"
                    data-action="remove" data-id="${item.id}"> 刪除 </button>
            </td>`
            , "")
        productList.innerHTML = templateHTML;

        // add deleteBtn eventListener
        const deleteBtns = document.querySelectorAll(".deleteBtn");
        deleteBtns.forEach(btn => {
            // .bind(this)強制綁定this指向，非必要不建議使用
            btn.addEventListener("click", this.deleteProduct.bind(this));
        })
    },
    deleteProduct(e) {
        const productId = e.target.dataset.id;
        axios.delete(`${api_base_url}/api/${api_path}/admin/product/${productId}`)
            .then(res => {
                if (res.data.success) {
                    const product = this.data.products.find(item => item.id === productId);
                    alert(`${res.data.message}，產品名稱:${product.title}，產品ID:${product.id}`);
                    this.getData();
                }
            })
            .catch(err => {
                console.dir(err);
            })
    },
    init() {
        // get token, add token to headers
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
        axios.defaults.headers.common['Authorization'] = token;
        this.getData();
    }
}

app.init();