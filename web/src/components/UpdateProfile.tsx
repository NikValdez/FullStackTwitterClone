import { useMutation, useQuery } from "@apollo/client"
import { ErrorMessage, Field, Form, Formik } from "formik"
import gql from "graphql-tag"
import React, { useState } from "react"
import Modal from "react-modal"
import { ME_QUERY } from "../pages/Profile"
import { customStyles } from "../styles/CustomModalStyles"

const UPDATE_PROFILE_MUTATION = gql`
  mutation updateProfile(
    $id: Int!
    $bio: String
    $location: String
    $website: String
    $avatar: String
  ) {
    updateProfile(
      id: $id
      bio: $bio
      location: $location
      website: $website
      avatar: $avatar
    ) {
      id
    }
  }
`

interface ProfileValues {
  id: number
  bio: string
  location: string
  website: string
  avatar: string
}

function UpdateProfile() {
    const {loading, error, data} = useQuery(ME_QUERY)
  const [updateProfile] = useMutation(UPDATE_PROFILE_MUTATION, {
    refetchQueries: [{ query: ME_QUERY }],
  })
  const [modalIsOpon, setIsOpen] = useState(false)

  if(loading) return <p>Loading...</p>
  if(error) return <p>{error.message}</p>

  const initialValues: ProfileValues = {
    id: data.me.Profile.id,
    bio: data.me.Profile.bio,
    location: data.me.Profile.location,
    website: data.me.Profile.website,
    avatar: data.me.Profile.avatar,
  }

  const openModal = () => {
    setIsOpen(true)
  }
  const closeModal = () => {
    setIsOpen(false)
  }

  return (
    <div>
      <button onClick={openModal}>Update Profile</button>
      <Modal
        isOpen={modalIsOpon}
        onRequestClose={closeModal}
        contentLabel="Modal"
        style={customStyles}
      >
        <Formik
          initialValues={initialValues}
          // validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting }) => {
            setSubmitting(true)
            await updateProfile({
              variables: values,
            })

            setSubmitting(false)
            setIsOpen(false)
          }}
        >
          <Form>
            <Field name="bio" type="text" as="textarea" placeholder="Bio" />
            <ErrorMessage name="bio" component={"div"} />
            <Field name="location" type="location" placeholder="Location" />
            <ErrorMessage name="location" component={"div"} />
            <Field name="website" type="website" placeholder="Website" />
            <ErrorMessage name="website" component={"div"} />

            <button type="submit" className="login-button">
              <span>Update Profile</span>
            </button>
          </Form>
        </Formik>
      </Modal>
    </div>
  )
}
export default UpdateProfile 
