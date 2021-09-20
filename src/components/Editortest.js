import { render, screen } from '@testing-library/react'; // functions render and screen
import { CKEditor } from "@ckeditor/ckeditor5-react";

// https://testing-library.com/docs/react-testing-library/example-intro

// testing app component renders, and look for text ckeditor
test('renders editor', () => {
    const { container } = render(<CKEditor />);

    expect(container).not.toBeEmptyDOMElement();
});