import {useState, useEffect} from 'react'
import {signup, isAuth} from './../../actions/auth'
import Router from 'next/router'
const SignupComponent = () => {


    const [values, setValues] = useState({
        name: '',
        email: '',
        password: '',
        passwordConfirm: '',
        error: '',
        loading: false,
        message: '',
        showForm: true
    })

    const {name, email, password, passwordConfirm,  error, loading, message, showForm} = values

    useEffect(() => {
        isAuth() && Router.push('/')


    }, [])

    const handleSubmit = (e) => {
        e.preventDefault()
        setValues({...values, error:false, loading:true})
        const user = {name, email, password, passwordConfirm}
        signup(user).then(data => {
            if(data.error) {
                setValues({...values, error: data.error, loading: false})
            }
            else {
                setValues({
                    ...values,
                    name: '',
                    password: '',
                    passwordConfirm: '',
                    email: '',
                    error: '',
                    loading: false,
                    showForm: false,
                    message: data.message
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




    const signupForm = () => {
        return(
            <form onSubmit={handleSubmit}>
                <div className='form-group'>
                    <input value = {name} type="text" className="form-control" placeholder = "type your name" onChange={handleChange('name')} />
                </div>
                <div className='form-group'>
                    <input value = {email} type="email" className="form-control" placeholder = "type your email" onChange={handleChange('email')} />
                </div>
                <div className='form-group'>
                    <input value = {password} type="password" className="form-control" placeholder = "type your password" onChange={handleChange('password')} />
                </div>
                <div className='form-group'>
                    <input value = {passwordConfirm} type="password" className="form-control" placeholder = "type your password again" onChange={handleChange('passwordConfirm')} />
                </div>
                <button className='btn btn-primary'>signup</button>
            </form>
        )
    }
    return(
        <React.Fragment>
            {showError()}
            {showLoading()}
            {showMessage()}
            {showForm && signupForm()}
        </React.Fragment>
    )

}

export default SignupComponent