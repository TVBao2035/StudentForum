import { useLocation, useNavigate } from "react-router-dom"
import { getDetailsPost } from "../../API/PostAPI";
import { useEffect, useState } from "react";
import { Avatar, Input } from "../../Components";
import { Editor } from '@tinymce/tinymce-react';
import timeFormat from "../../Helpers/timeFormat";
import { getAllCategories } from "../../API/CategoryAPI";
import { AiOutlineLike } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa6";
import ContaierComment from "../../Components/Comment/ContaierComment";
import { getAllCommentByPostId } from "../../API/CommentAPI";
var formData = new FormData();
let count = 0;
const PostEdit = () => {
    const location = useLocation();
    const postId = location.search.split("=")[1];
    const [isLoading, setIsLoading] = useState(true);
    const [post, setPost] = useState({});
    const [errorList, setErrorList] = useState();
    const [typeUpLoad, setTypeUpLoad] = useState(0);
    const [isChangeImg, setIsChangeImg] = useState(false);
    const [categoriesList, setCategoriesList] = useState([]);
    const [commentsList, setCommentsList] = useState([]);

    const countComments = (comments) => {
        if(comments?.length !== 0){
            for(let i=0; i<comments?.length; i++){
                count++;
                countComments(comments[i]?.children);
            }
        } 
    }
    
    const fetchAllComment = async (postId) => {
        let res = await getAllCommentByPostId(postId);
        if (res.status !== 200) {
            alert(res.message);
            return;
        }
        setCommentsList(res.data)
    }
    const fetchGetAllCategories = async () => {
        let res = await getAllCategories();
        if(res.status !== 200) {
            alert(res.message);
            return;
        }
        setCategoriesList(res.data);
    }

    const fetchGetPost = async (postId) => {
        let res = await getDetailsPost(postId);
        if(res.status !== 200){
            alert(res.message);
            return;
        }
        setPost({...res.data, rootImage: res.data.image});
    }

    const handleChange = (e) => {
        setPost({
            ...post,
            [e.target.name]: e.target.value
        })
    }



    const handleUpLoad = (e) => {
        formData = new FormData();
        formData.append("file", e.target.files[0]);
        formData.append("upload_preset", process.env.REACT_APP_UPDATE_ACCESS_NAME);
        formData.append("asset_folder", "StudentForum");
        setPost({ ...post, image: URL.createObjectURL(e.target.files[0]) });
        setIsChangeImg(!isChangeImg);
    }
    
    useEffect(() => {
        fetchGetPost(postId);
        fetchGetAllCategories();
        fetchAllComment(postId);
        setIsLoading(false);
    }, [postId]);
    useEffect(()=>{
        countComments(commentsList);

    }, [])
    if(isLoading) return "...Loading"
  return (
    <div className="PostEdit container mb-5">
        <header className="d-flex justify-content-between">
            <div>
                <div>
                    <button className="btn btn-primary">Back</button>
                </div>
            </div>
            <div className="d-flex gap-2">
                <div>
                    <button className="btn btn-success">Save</button>
                </div>
                <div>
                    <button className="btn btn-danger">Delete</button>
                </div>
            </div>
        </header>
        <main>
            <div className="row">
                <div className="d-flex align-items-center gap-3 col">
                    <Avatar link={post?.User?.avatar} big />
                    <div>
                        <h5 className="m-0">{post?.User?.name}</h5>
                        <p>Ngày đăng {timeFormat(post?.createdAt)}</p>
                    </div>
                </div>
                <div className="col d-flex justify-content-center align-items-center gap-5">
                   <div className="d-flex align-items-center gap-1">
                        <AiOutlineLike/>
                        <p>{post?.Likes?.length} lượt thích</p>
                   </div>
                    <div className="d-flex align-items-center gap-1">
                        <FaRegComment/>
                        <p>{count} lượt bình luận</p>
                   </div>
                </div>
            </div>
            <div>

            </div>
              <div className="row mt-4">
                  <div className="d-flex flex-column gap-2 col">
                      {
                          isChangeImg &&
                          <div className="mb-2 d-flex flex-column gap-2">
                              <div className="">
                                  <label className="fw-bold">Chọn phương thức:</label>
                                  <select className="form-select" value={typeUpLoad} onChange={(e) => setTypeUpLoad(e.target.value)}>
                                      <option value={'0'}>Link</option>
                                      <option value={'1'}>File ảnh</option>
                                  </select>
                              </div>
                              <div className=" d-flex align-items-end">
                                  {
                                    Number(typeUpLoad) === 0 ?
                                        <Input
                                            name={"image"} label="Hình ảnh"
                                            type="text" value={post?.image}
                                            handleChange={handleChange} setMessage={setErrorList}
                                            message={errorList?.image}
                                        />
                                        :
                                        <Input
                                            name={"image"} label="Hình ảnh"
                                            type="file" handleChange={handleUpLoad} setMessage={setErrorList}
                                            message={errorList?.image}
                                        />
                                  }
                              </div>
                          </div>
                      }
                      {
                          post?.image &&
                          <Avatar link={post?.image} none-round w-75 />
                      }
                      <div className="d-flex justify-content-center">
                          {
                              !isChangeImg ?
                                  <button className="btn btn-secondary" onClick={() => setIsChangeImg(!isChangeImg)}>Thay đổi</button>
                                  :
                                  <button
                                      className="btn btn-danger"
                                      onClick={() => {
                                          setIsChangeImg(!isChangeImg);
                                          setPost({ ...post, image: post.rootImage })
                                      }}>Hủy</button>
                          }
                      </div>
                  </div>
                  <div className="col-4">
                      <label className="fw-bold">Thể loại:</label>
                      <select class="form-select" value={post?.Category?.id}>
                          {
                              categoriesList.map(category => <option value={category?.id}>{category?.name}</option>)
                          }
                      </select>
                  </div>
              </div>
            <div className="my-3">
                <textarea name="content" className=" form-control" value={post.content} onChange={handleChange}/>
            </div>
        </main>
        <hr />
        <footer>
            {
            !isLoading && postId !== undefined && 
              <ContaierComment
                  big
                  postId={post.id}
              />
            }
        </footer> 
    </div>
  )
}

export default PostEdit