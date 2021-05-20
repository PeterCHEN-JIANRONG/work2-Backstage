// DOM元素
const usernameDOM = document.querySelector("#username");
const passwordDOM = document.querySelector("#password");
const loginBtn = document.querySelector("#login");
const checkBtn = document.querySelector("#check");
const form = document.querySelector('#form');

//form submit方式
// form.addEventListener('submit', login);
loginBtn.addEventListener("click", login);
checkBtn.addEventListener("click", checkLoginStatus);

function login(e) {
    // 移除submit預設行為，或可改 type="button"
    e.preventDefault();
    const username = usernameDOM.value;
    const password = passwordDOM.value;
    const user = {
        username,
        password
    };

    axios.post(`${api_base_url}/admin/signin`, user)
        .then(res => {
            if (res.data.success) {
                // 解構賦值
                const { token, expired } = res.data;
                // set cookie, expired設置有效時間
                document.cookie = `hexToken=${token}; expires=${new Date(expired)}`;
                // checkLoginStatus();
                window.location = "index.html";
            } else {
                alert(`${res.data.message}，請確認帳號、密碼是否輸入正確`);
                usernameDOM.value = "";
                passwordDOM.value = "";
            }
        })
        .catch(error => {
            console.dir(error);
        })
}

function checkLoginStatus() {
    // get token
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    // add token to headers
    axios.defaults.headers.common['Authorization'] = token;

    axios.post(`${api_base_url}/api/user/check`)
        .then(res => {
            if (res.data.success) {
                checkBtn.classList.add("btn-success");
                checkBtn.textContent = "檢查(已登入)"
            } else {
                checkBtn.classList.remove("btn-success");
                checkBtn.textContent = "檢查(未登入)"
            }
        })
}