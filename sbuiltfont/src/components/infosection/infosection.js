import React from 'react'
import { Link } from 'react-router-dom'
import { Container } from '../../globalstyle'
import { Button } from '../navbar/navbar.element'
import { Info, InfoColumn, InfoRow, TextWrapper, Topline, Heading, Subtitle, ImageWrapper, Img } from './infosection.element'

const InfoSection = ({ lightBg, imgStart, lightTopLine, lightText, lightTextDesc, topline, headline, description, buttonLabel, primary, img, start, buttonlink, buttonshow, Sectionmin }) => {
    return (
        <>
            <section style={{ padding: '25px', background: `${lightBg ? lightBg : '#fff'}` }}>
                <Info lightBg={lightBg}>
                    <Container>
                        <InfoRow imgStart={imgStart}>
                            <InfoColumn>
                                <TextWrapper>
                                    <Topline lightTopLine={lightTopLine}>{topline}</Topline>
                                    <Heading lightText={lightText}>{headline.split('<br/>').map((item,index) => {
                                        let arr2 = []
                                        if(index != 0){
                                            arr2.push(<br />)
                                        }
                                        arr2.push(item)
                                        return(
                                            arr2
                                        )
                                    })}</Heading>
                                    <Subtitle lightTextDesc={lightTextDesc}>{description}</Subtitle>
                                    <Link to={buttonlink} style={{ display: buttonshow }}>
                                        <Button primary={primary} Big fontBig>{buttonLabel}</Button>
                                    </Link>
                                </TextWrapper>
                            </InfoColumn>
                            <InfoColumn>
                                <ImageWrapper start={start}>
                                    <Img src={img} alt='Image' />
                                </ImageWrapper>
                            </InfoColumn>
                        </InfoRow>
                    </Container>
                </Info>
            </section>
        </>
    )
}

export default InfoSection