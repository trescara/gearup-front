import React, { Component } from 'react'
import { Checkbox, TextArea, Card, Icon, Image, Button, Modal, Form, Header, Dropdown } from 'semantic-ui-react'

const gearCategories = [
  {text:'Camp',
   value:'camp' ,
   image: {avatar:true, src:'http://szzljy.com/images/camping/camping2.jpg'}
  },
  {text:'Climb',
   value:'climb' ,
   image: {avatar:true, src:'https://cdn.shopify.com/s/files/1/1554/2851/files/guisdebooks_pop2_580x.jpg'}
  },
  {text:'Cycle',
   value:'cycle' ,
   image: {avatar:true, src:'https://pbs.twimg.com/media/DaHaELEUMAU8LEW.jpg'}
  },
  {text:'Paddle',
   value:'paddle' ,
   image: {avatar:true, src:'https://upload.wikimedia.org/wikipedia/commons/9/96/Kayak_Playboat_ManchesterNH.jpg'}
  },
  {text:'Snow',
   value:'snow' ,
   image: {avatar:true, src:'https://upload.wikimedia.org/wikipedia/commons/5/5d/Aviano_snowboarder_2.JPG'}
  },
  {text:'Hike',
   value:'hike' ,
   image: {avatar:true, src:'http://honolulumagazine-images.dashdigital.com/images/2017/07-17/hike-of-the-month-ehukai-trail.jpg'}
  }
]

class PostGear extends Component {
  state = {
    postedItems: [],
    modalNewGearOpen: false,
    image: '',
    category: '',
    gearType: '',
    manufacturer: '',
    description: '',
    price: '',
    available: true
  }

  componentDidMount() {
    this.fetchItems()
  }

  fetchItems = () => {
    fetch(`https://gear-up-backend.herokuapp.com/gear/user/testemail@testemail.com`)
    .then(response => response.json())
    .then(response => this.setState({
      postedItems: response.gear,
    }))
  }

  handleNewGearOpen = (event) => {this.setState({ modalNewGearOpen: true }), this.setState({itemID: event.target.id})}
  handleNewGearClose = (event) => this.setState({ modalNewGearOpen: false })

  handleChange = (event) => {
    const name = event.target.name
    this.setState({[name]: event.target.value})
  }

  postGearSubmit = (event) => {
    event.preventDefault()
    const url = 'https://gear-up-backend.herokuapp.com/gear'
    const postData = {
      gear_type: this.state.gearType,
      category: this.state.category,
      description: this.state.description,
      owner: 'testemail@testemail.com',
      available: this.state.available,
      cost_per_day: this.state.price,
      manufacturer: this.state.manufacturer,
      renter: '',
      image_url: this.state.image
    }
    fetch(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(postData),
    })
    .then(response => this.fetchItems())
    this.setState({
      image: '',
      category: '',
      gearType: '',
      manufacturer: '',
      description: '',
      price: '',
      available: true
    })
    this.handleNewGearClose()

  }

  handleDropdownChange = (event) => {
    const dropdown = document.getElementById('dropdownMenu')
    this.setState({category: dropdown.children[0].innerText.toLowerCase()})
  }

  checkboxToggle = (event) => {
    this.setState({available: !this.state.available})
  }

  onUpdateSubmit = (event) => {
    event.preventDefault()
    const url = `https://gear-up-backend.herokuapp.com/gear/${this.state.itemID}`
    const postData = {
      gear_type: this.state.gearType,
      category: this.state.category,
      description: this.state.description,
      owner: 'testemail@testemail.com',
      available: this.state.available,
      cost_per_day: this.state.price,
      manufacturer: this.state.manufacturer,
      renter: '',
      image_url: this.state.image
    }
    fetch(url, {
      method: 'PUT',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(postData),
    })
    .then(response => this.fetchItems())
    this.setState({
      image: '',
      category: '',
      gearType: '',
      manufacturer: '',
      description: '',
      price: '',
      available: true
    })
    this.handleNewGearClose()
  }


  render() {
    return (
      <div>
        <h1> User Profile </h1>
        <Modal trigger={ <Button onClick={this.handleNewGearOpen} className='add-gear'>Add New Item</Button>} open={this.state.modalNewGearOpen}
        onClose={this.handleNewGearClose} basic size='small'>
          <Header Icon='add user' content='Add New Gear' />
          <Modal.Content>
            <Form>
              <Form.Field>
                <label>Image URL</label>
                <input id='new-gear-image-url' placeholder='Image Url' name='image' value={this.state.image} onChange={this.handleChange} />
              </Form.Field>
              <Form.Field>
                <Dropdown id='dropdownMenu' placeholder='Category' fluid selection options={ gearCategories } name='category' onChange={(event) => {setTimeout(function() {this.handleDropdownChange(event)}.bind(this), 100)}} />
              </Form.Field>
              <Form.Field>
                <label>Gear Type</label>
                <input id='new-gear-gear-type' placeholder='Gear Type e.g. Tent' name='gearType' value={this.state.gearType} onChange={this.handleChange} />
              </Form.Field>
              <Form.Field>
                <label>Manufacturer</label>
                <input id='new-gear-manufacturer' placeholder='Manufacturer' name='manufacturer' value={this.state.manufacturer} onChange={this.handleChange} />
              </Form.Field>
              <Form.Field>
                <label>Description</label>
                <TextArea id='new-gear-description' placeholder='Description' maxLength='140' name='description' value={this.state.description} onChange={this.handleChange} />
              </Form.Field>
              <Form.Field>
                <label>Price per Day</label>
                <input id='new-gear-price' placeholder='Price Per Day' name='price' value={this.state.price} onChange={this.handleChange} />
              </Form.Field>
              <Form.Field>
                <label>Available</label>
                <Checkbox toggle id='new-gear-availability' name='available' value={this.state.available} onChange={this.checkboxToggle} />
              </Form.Field>
              <Button onClick={this.postGearSubmit}>Submit</Button>
          </Form>
          </Modal.Content>
          <Modal.Actions>
          </Modal.Actions>
        </Modal>
        <section>
          {this.state.postedItems.map((item,index) => {

            return <Card key={index}>
              <Image style={{height:'290px', width:'290px'}} src={item.image_url} />
              <Card.Content>
                <Card.Header>{item.gear_type} - {item.manufacturer}</Card.Header>
                <Card.Description>{item.description}</Card.Description>
              </Card.Content>
              <Card.Content extra>
                <Card.Header>${item.cost_per_day} per day - {item.available ? 'available' : 'unavailable'} </Card.Header>
              </Card.Content>
              <Modal trigger={ <Button id={item.id} onClick={this.handleNewGearOpen} className='add-gear'>Edit Item</Button>} open={this.state.modalNewGearOpen}
              onClose={this.handleNewGearClose} basic size='small'>
                <Header Icon='add user' content='Add New Gear' />
                <Modal.Content>
                  <Form>
                    <Form.Field>
                      <label>Image URL</label>
                      <input id='new-gear-image-url' placeholder='Image Url' name='image' value={this.state.image} onChange={this.handleChange} />
                    </Form.Field>
                    <Form.Field>
                      <Dropdown id='dropdownMenu' placeholder='Category' fluid selection options={ gearCategories } name='category' onChange={(event) => {setTimeout(function() {this.handleDropdownChange(event)}.bind(this), 100)}} />
                    </Form.Field>
                    <Form.Field>
                      <label>Gear Type</label>
                      <input id='new-gear-gear-type' placeholder='Gear Type e.g. Tent' name='gearType' value={this.state.gearType} onChange={this.handleChange} />
                    </Form.Field>
                    <Form.Field>
                      <label>Manufacturer</label>
                      <input id='new-gear-manufacturer' placeholder='Manufacturer' name='manufacturer' value={this.state.manufacturer} onChange={this.handleChange} />
                    </Form.Field>
                    <Form.Field>
                      <label>Description</label>
                      <TextArea id='new-gear-description' placeholder='Description' maxLength='140' name='description' value={this.state.description} onChange={this.handleChange} />
                    </Form.Field>
                    <Form.Field>
                      <label>Price per Day</label>
                      <input id='new-gear-price' placeholder='Price Per Day' name='price' value={this.state.price} onChange={this.handleChange} />
                    </Form.Field>
                    <Form.Field>
                      <label>Available</label>
                      <Checkbox toggle id='new-gear-availability' name='available' value={this.state.available} onChange={this.checkboxToggle} />
                    </Form.Field>
                    <Button onClick={this.onUpdateSubmit}>Update Item</Button>
                    <Button onClick={this.postGearSubmit}>Delete</Button>
                </Form>
                </Modal.Content>
                <Modal.Actions>
                </Modal.Actions>
              </Modal>
            </Card>
          })}
        </section>
      </div>
    )
  }

}



export default PostGear