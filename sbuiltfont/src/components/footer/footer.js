import React,{useState} from 'react'
import { Button } from '../navbar/navbar.element'
import mainLogo from'../../../src/Logos.png';
import { FooterContainer,
    FooterSubheading,
    FooterSubscription,
    FooterSubtext,
    Form,FormInput,
    FooterLinkContainer,
    FooterLinkWrapper,
    FooterLinkItem,
    FooterLinkTitle,
    FooterLink,
    SocialMedia,
    SocialMediaWrap,
    SocialLogo,
    SocialIcon,
    SocialIcons,
    SocialIconLink,
    WebsiteRight
} 

from './footer.elements'
import { Link } from 'react-router-dom'
import { FaFacebook,FaInstagram,FaLinkedin,FaYoutube} from 'react-icons/fa'


const Footer = () => {
    const [value, setvalue] = useState('')
    const handleSubmit = (e) =>  {
        setvalue('')
        e.preventDefault();
    }
    return (
        <div>
            <FooterContainer>
                {/* <FooterSubscription>
                    <FooterSubheading>
                        สามารถสมัครรับข่าวสารจากเรา
                    </FooterSubheading>
                    <FooterSubtext>
                        You can contact us any time 
                    </FooterSubtext>
                    <Form>
                        <FormInput name='email' type='email' placeholder='Your email' value={value} onChange = {(e) => {setvalue(e.target.value)}}/>
                            <Button fontBig onClick={handleSubmit}>Subscribe</Button>         
                    </Form>
                </FooterSubscription> */}
                
                <SocialMedia>
                <SocialMediaWrap>
                <SocialLogo to='/'>
                    <img  src={mainLogo} style={{width:'50px',borderRadius:'10px'}} alt=''/>
                </SocialLogo>
                
                <SocialIcons>
                    <SocialIconLink href='https://www.facebook.com/minnn7410' aria-label='FaceBook' target='_blank'> 
                        <FaFacebook />
                    </SocialIconLink>
                    <SocialIconLink href='https://www.instagram.com/sbuilt__/' aria-label='Instragram' target='_blank'> 
                        <FaInstagram />
                    </SocialIconLink>
                    <SocialIconLink href='https://www.youtube.com/watch?v=oHg5SJYRHA0' aria-label='Youtube' target='_blank'> 
                        <FaYoutube />
                    </SocialIconLink>
                    <SocialIconLink href='https://www.linkedin.com/in/sittisak-rodpraya-4899481a0/' aria-label='Linkedin' target='_blank'> 
                        <FaLinkedin />
                    </SocialIconLink>
                </SocialIcons>
                </SocialMediaWrap>
                </SocialMedia>
            </FooterContainer>
        </div>
    )
}

export default Footer