export default function Navbar(props) {
    return {
        $template: `<nav class="navbar navbar-expand-lg"></nav>
                    <nav class="navbar navbar-expand-lg fixed-top navbar-dark bg-dark">
                        <div class="container-fluid">
                            <a class="navbar-brand" href="#">
                                <img src="/gui/logo.png" width="30" height="30" class="d-inline-block align-top" alt="">
                                Kaffit
                            </a>
                            <ul class="navbar-nav d-flex flex-row me-1">
                                <li class="nav-item me-5">
                                    <a class="nav-link text-white" href="/feed"><i class="bi bi-house-fill" style="font-size: 20px"></i></a>
                                </li>
                                <li class="nav-item me-5">
                                    <a class="nav-link text-white" href="/createpost"><i class="bi bi-plus-circle-fill" style="font-size: 20px"></i></a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link text-white" href="/editprofile"><i class="bi bi-person-fill" style="font-size: 20px"></i></a>
                                </li>
                            </ul>
                        </div>
                    </nav>`,
        current: props.page
    }
}
