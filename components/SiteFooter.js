import React from "react"

const SiteFooter = ({ variant, ...props }) => {
  switch (variant) {
    case 1:
      return (
          <Footer
            bg="white"
            color='gray.0'
            display="flex"
            flexWrap='wrap'
            py={4}
            px={4}
            borderTop="1px solid rgba(0,0,0,.1)"
            {...props}
          >
            <Div width={[1,1/2]} pr={[0,5]}>
              <A
                display="inline-flex"
                alignItems="center"
                href="https://cloudflare.design"
                fontWeight={700}
                fontSize={3}
              >
                <Logo variant='mark' width={32} /> 
                <Span ml={2}>Cloudflare Design</Span>

              </A>

              <P fontSize={2} mt={2} mb={0}>
                We're growing our teams in San Francisco, London, and Austin! We welcome applications from everyone and especially encourage underrepresented minorities to apply. 
              </P>
              <P fontSize={2}>
                To apply, please email <A color='gray.0' fontWeight={600} href="mailto:designjobs@cloudflare.com">designjobs@cloudflare.com</A> with your portfolio and 3-5 sentences about why you're interested in joining our team.   
              </P>
            </Div>
            <Div width={[1,1/4]}>
              <H4 fontWeight={600} fontSize={2} mt={[4,0]}>Colophon</H4>
              <A py={1} lineHeight={1.5} fontSize={2} display='block' href='https://github.com/gka/chroma.js/' children="Chroma" />
              <A py={1} lineHeight={1.5} fontSize={2} display='block' href='https://github.com/jxnblk/colorable' children="Colorable" />
              <A py={1} lineHeight={1.5} fontSize={2} display='block' href='https://github.com/lyft/coloralgorithm' children="ColorBox" />
              <A py={1} lineHeight={1.5} fontSize={2} display='block' href='https://cssstats.com' children="Css Stats" />
              <A py={1} lineHeight={1.5} fontSize={2} display='block' href='https://github.com/jxnblk/palx' children="Palx" />
              <A py={1} lineHeight={1.5} fontSize={2} display='block' href='https://unsplash.com/developers' children="Unsplash" />
            </Div>
            <Div mt={[ 3,0 ]} width={[1,1/4]} textAlign={['left', 'right']}>
              <A
                href="https://github.com/cloudflare-design"
                fontSize={2}
                color="blue.4"
                display="inline-flex"
                alignItems='center'
                fontWeight={700}
              >
                <Icon title="github" color="gray.2" size="20" type="github"/>
                <Span ml={2}>GitHub</Span>
              </A>
            </Div>
          </Footer>
      )
  }
}

SiteFooter.defaultProps = {
  variant: 1
}

export default SiteFooter
