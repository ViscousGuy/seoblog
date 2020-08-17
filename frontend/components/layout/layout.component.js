import Header from './../header/header.component'
const Layout = ({children}) => {
    return (
        <React.Fragment>
            <Header/>
            {children}
        </React.Fragment>
    )
}


export default Layout