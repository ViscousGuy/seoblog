import Layout from '../../../components/layout/layout.component';
import Admin from '../../../components/auth/admin-route.component';
import ReadBlogs from '../../../components/crud/blog-read.component.js';


const Blog = () => {
    return (
        <Layout>
            <Admin>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12 pt-5 pb-5">
                            <h2>Manage Blogs</h2>
                        </div>
                        <div className="col-md-12">
                            <ReadBlogs/>
                        </div>
                    </div>
                </div>
            </Admin>
        </Layout>
    );
};

export default Blog;
