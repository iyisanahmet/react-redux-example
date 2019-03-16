import React, { Component } from 'react';
import TextInputGroup from '../layout/TextInputGroup';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import axios from 'axios';

class EditContact extends Component {
  state = {
    name: '',
    email: '',
    phone: '',
    errors: {}
  };

  componentWillReceiveProps(nextProps, nextState) {
    const { name, email, phone } = nextProps.contact;
    this.setState({
      name,
      email,
      phone
    });
  }

  componentDidMount() {
    const { id } = this.props.match.params;

    this.props.getContact(id);
  }

  onSubmit = e => {
    e.preventDefault();

    const { name, email, phone } = this.state;

    // Check For Errors
    if (name === '') {
      this.setState({ errors: { name: 'Name is required' } });
      return;
    }

    if (email === '') {
      this.setState({ errors: { email: 'Email is required' } });
      return;
    }

    if (phone === '') {
      this.setState({ errors: { phone: 'Phone is required' } });
      return;
    }

    const { id } = this.props.match.params;

    const updContact = {
      id,
      name,
      email,
      phone
    };

    this.props.updateContact(updContact);

    // Clear State
    this.setState({
      name: '',
      email: '',
      phone: '',
      errors: {}
    });

    this.props.history.push('/');
  };

  onChange = e => this.setState({ [e.target.name]: e.target.value });

  render() {
    const { name, email, phone, errors } = this.state;

    return (
      <div className="card mb-3">
        <div className="card-header">Edit Contact</div>
        <div className="card-body">
          <form onSubmit={this.onSubmit}>
            <TextInputGroup
              label="Name"
              name="name"
              placeholder="Enter Name"
              value={name}
              onChange={this.onChange}
              error={errors.name}
            />
            <TextInputGroup
              label="Email"
              name="email"
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={this.onChange}
              error={errors.email}
            />
            <TextInputGroup
              label="Phone"
              name="phone"
              placeholder="Enter Phone"
              value={phone}
              onChange={this.onChange}
              error={errors.phone}
            />
            <input
              type="submit"
              value="Update Contact"
              className="btn btn-light btn-block"
            />
          </form>
        </div>
      </div>
    );
  }
}

EditContact.propTypes = {
  getContact: PropTypes.func.isRequired,
  contact: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  contact: state.contact.contact
});

const mapDispatchToProps = dispatch => ({
  getContact: id => {
    axios
      .get(`http://jsonplaceholder.typicode.com/users/${id}`)
      .then(res => dispatch({ type: 'GET_CONTACT', payload: res.data }));
  },
  updateContact: contact => {
    axios
      .put(`http://jsonplaceholder.typicode.com/users/${contact.id}`, contact)
      .then(res => dispatch({ type: 'UPDATE_CONTACT', payload: res.data }));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditContact);
