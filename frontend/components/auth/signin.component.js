import {useState, useEffect} from 'react'
import Router from 'next/router'
import {signin, authenticate, isAuth} from './../../actions/auth'
import LoginGoogle from './../../components/auth/google-login.component'

const SigninComponent = () => {


    const [values, setValues] = useState({
        email: '',
        password: '',
        error: '',
        loading: false,
        message: '',
        showForm: true
    })

    const { email, password, passwordConfirm,  error, loading, message, showForm} = values


    useEffect(() => {
        isAuth() && Router.push('/')


    }, [])

    const handleSubmit = (e) => {
        e.preventDefault()
        setValues({...values, error:false, loading:true})
        const user = { email, password }
        signin(user).then(response => {
            if(response.error) {
                setValues({...values, error: response.error, loading: false})
            }
            else {
                authenticate(response.data, () => {
                    if(isAuth() && isAuth().role === 1) {
                        Router.push('/admin')
                    } else {
                        Router.push('/user')
                    }

                })

                
            }
        })
    }

    const handleChange = name => e => {
        setValues({...values, error: false, [name] : e.target.value})
    }


    const showLoading = () => (loading ? <div className='alert alert-info'>Loading...</div> : '')
    const showError = () => (error ? <div className="alert alert-danger"> {error} </div>: '')
    const showMessage = () => (message ? <div className="alert alert-info">{message}</div> : '')




    const signinForm = () => {
        return(
            <form onSubmit={handleSubmit}>
                <div className='form-group'>
                    <input value = {email} type="email" className="form-control" placeholder = "type your email" onChange={handleChange('email')} />
                </div>
                <div className='form-group'>
                    <input value = {password} type="password" className="form-control" placeholder = "type your password" onChange={handleChange('password')} />
                </div>
                <button className='btn btn-primary'>signin</button>
            </form>
        )
    }
    return(
        <React.Fragment>
            {showError()}
            {showLoading()}
            {showMessage()}
            <LoginGoogle/>
            {showForm && signinForm()}
        </React.Fragment>
    )

}

export default SigninComponent