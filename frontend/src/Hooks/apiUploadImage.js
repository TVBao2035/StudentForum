import axios from 'axios'

const apiUploadImage = async (image) => {
    return await axios.post(`https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUD_NAME}/image/upload`, image)
}

export default apiUploadImage;