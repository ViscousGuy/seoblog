import Layout from '../../../components/layout/layout.component';
import Private from '../../../components/auth/private-route.component';
import ReadBlogs from '../../../components/crud/blog-read.component.js';
import {isAuth} from './../../../actions/auth'


const Blog = () => {
    const  username = isAuth() && isAuth().username
    return (
        <Layout>
            <Private>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12 pt-5 pb-5">
                            <h2>Manage Blogs</h2>
                        </div>
                        <div className="col-md-12">
                            <ReadBlogs username={username}/>
                        </div>
                    </div>
                </div>
            </Private>
        </Layout>
    );
};

export default Blog;
