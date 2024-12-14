import Swal from "sweetalert2";

const swalApp = (icon, message) => {
    Swal.fire({
        title: message,
        icon: icon,
        toast: true,
        position: 'top-end',
        timerProgressBar: true,
        showConfirmButton: false,
        timer: 5000,
    });
}

export default swalApp;