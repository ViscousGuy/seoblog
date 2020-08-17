import moment from "moment";
import renderHTML from "react-render-html";
import Head from "next/head";
import Link from "next/link";
import Layout from "../../components/layout/layout.component";
import { singleTag } from "../../actions/tag";
import { API, DOMAIN, APP_NAME, FB_APP_ID } from "../../config";
import Card from './../../components/blogs/blogs.card.component'

const Tag = ({data, query}) => {
    const head = () => (
        <Head>
          <title>
            {data.tag.name} | {APP_NAME}
          </title>
          <meta name="description" content={`Best blogs on ${data.tag.name}`} />
          <link rel="canonical" href={`${DOMAIN}/categories/${query.slug}`} />
          <meta property="og:title" content={`${data.tag.name}| ${APP_NAME}`} />
          <meta property="og:description" content={`Best blogs on ${data.tag.name}`} />
          <meta property="og:type" content="webiste" />
          <meta property="og:url" content={`${DOMAIN}/categories/${query.slug}`} />
          <meta property="og:site_name" content={`${APP_NAME}`} />
    
          <meta
            property="og:image"
            content={`${DOMAIN}/static/images/seoblog.jpg`}
          />
          <meta
            property="og:image:secure_url"
            content={`${DOMAIN}/static/images/seoblog.jpg`}
          />
          <meta property="og:image:type" content="image/jpg" />
          <meta property="fb:app_id" content={`${FB_APP_ID}`} />
        </Head>
      );
    return (
        <React.Fragment>
            {head()}
            <Layout>
                <main>
                    <div className="container-fluid text-center">
                        <header>
                            <div className="col-md-12 pt-3">
                                <h1 className="display-4 font-weight-bold">
                                    {data.tag.name}
                                </h1>
                                {data.blogs.map((b, i) => {
                                    return (
                                        <div>
                                            <Card key={i} blog={b}></Card>
                                            <hr/>
                                        </div>
                                        
                                    )
                                })}
                            </div>
                        </header>
                    </div>
                </main>
            </Layout>
        </React.Fragment>
    )
}

Tag.getInitialProps = ({query, req}) => {
    // const token = getCookie('token')
    const token = req.headers.cookie.split('=')[1]
    return singleTag(query.slug, token).then(data => {
        if(data.error) console.log(data.error)
        else {
            return {data: data, query}
        }
    })

}






export default Tag;
