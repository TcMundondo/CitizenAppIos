import React from 'react'
import { BottomModalProvider, useBottomModal } from 'react-native-bottom-modal'

const App = () => {
    const { showModal } = useBottomModal() ;
  return (
      <BottomModalProvider>
        <Container>
        <Button
          onPress={() =>
            showModal({
              header: <ModalHeader/>,
              content: (
                <StyledModal>
                 
                </StyledModal>
              ),
            })
          }
        >
          With handle
        </Button>
      </Container>
      </BottomModalProvider>
  )
}