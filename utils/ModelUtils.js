
const pages = [
    {name: "Home",          route: "/",             reqPerm:"none"},
    {name: "Card Store",    route: "/cards",        reqPerm:"none"},
    {name: "Login",         route: "/login",        reqPerm:"none"},
    {name: "Register",      route: "/register",     reqPerm:"none"}
];
module.exports = class ModelUtils {
    

    buildHeader(route, user) {
        const nav = [];
        pages.forEach(page => {
            if(this.canLoadPage(page, user)){
                nav.push({
                    name: page.name,
                    route: page.route,
                    selected: page.route === route ? "selected" : ""
                })
            }
        })
        return {
            nav,
            user
        };
    }

    canLoadPage (page, user) {
        return true;
    }
}