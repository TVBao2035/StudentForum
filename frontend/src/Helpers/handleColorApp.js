

const handleColorApp = () => {
    const styles = JSON.parse(localStorage.getItem('themesApp'));
    document.body.style.backgroundColor = styles?.backgroupColor;
    document.body.style.color = styles?.color;
    

}

export default handleColorApp;