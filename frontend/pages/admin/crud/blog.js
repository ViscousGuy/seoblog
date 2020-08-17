import Layout from '../../../components/layout/layout.component';
import Admin from '../../../components/auth/admin-route.component';
import BlogCreate from '../../../components/crud/blog-create.component.js';


const Blog = () => {
    return (
        <Layout>
            <Admin>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12 pt-5 pb-5">
                            <h2>Create a new blog</h2>
                        </div>
                        <div className="col-md-12">
                            <BlogCreate/>
                        </div>
                    </div>
                </div>
            </Admin>
        </Layout>
    );
};

export default Blog;
