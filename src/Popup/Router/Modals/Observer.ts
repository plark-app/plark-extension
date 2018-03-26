import debugProvider from 'debug';

const debug = debugProvider('MODAL');

class ModalObserver {
    modalRootComponent;

    openModal(modalType, modalProps: any = {}) {
        this.modalRootComponent.setState(() => {
            debug(modalType, modalProps, this.modalRootComponent);
            return {
                modalType: modalType,
                modalProps: modalProps
            }
        });
    }

    closeModal() {
        this.modalRootComponent.setState(() => {
            return {
                modalType: null,
                modalProps: {}
            };
        });
    }

    setRootComponent(modalRootComponent) {
        this.modalRootComponent = modalRootComponent;
    }
}

const modalObserverInstance = new ModalObserver();


export {
    ModalObserver,
    modalObserverInstance
}