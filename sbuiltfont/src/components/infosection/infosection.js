import React from 'react'
import { Link } from 'react-router-dom'
import { Container } from '../../globalstyle'
import { Button } from '../navbar/navbar.element'
import { Info,InfoColumn,InfoRow,TextWrapper,Topline,Heading,Subtitle, ImageWrapper, Img } from './infosection.element'

const InfoSection = ({ lightBg,imgStart,lightTopLine,lightText,lightTextDesc,topline,headline,description,buttonLabel,primary,img,start}) => {
    return (
        <>
            <Info lightBg = {lightBg}>
                <Container>
                    <InfoRow imgStart={imgStart}>
                        <InfoColumn>
                            <TextWrapper>
                                <Topline lightTopLine={lightTopLine}>{topline}</Topline>
                                <Heading lightText = {lightText}>{headline}</Heading>
                                <Subtitle lightTextDesc={lightTextDesc}>{description}</Subtitle>
                                <Link to='#'>
                                    <Button primary={primary} Big fontBig>{buttonLabel}</Button>
                                </Link>
                            </TextWrapper>
                        </InfoColumn>
                        <InfoColumn>
                            <ImageWrapper start={start}>
                                <Img src={img} alt='Image'/>
                            </ImageWrapper>
                        </InfoColumn>
                    </InfoRow>
                </Container>
            </Info>
        </>
    )
}

export default InfoSection