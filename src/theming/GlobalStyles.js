import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(theme => {
  return {
    '@global': {
      html: {
        'font-size': '14px'
      },
      body: {
        'font-size': '1rem',
        'line-height': 1.6,
        'font-weight': 400,
        color: '#555',
        'text-rendering': 'optimizelegibility',
        'font-family': '"Open Sans", Helvetica, Arial, sans-serif'
      },
      a: {
        color: theme.palette.primary[500],
        textDecoration: 'none',
        '&:hover': {
          textDecoration: 'underline'
        }
      },
      p: {
        color: '#555',
        'line-height': '1.6'
      },
      'li, p': {
        color: '#555',
        'line-height': '1.6'
      },

      // Blog article styles...
      '.img-responsive': {
        width: '100%'
      },
      '.list-unstyled': {
        //'padding-left': 0,
        //'list-style': 'none'
      },

      'ul, ol': {
        'margin-top': 0,
        'margin-bottom': '10px'
      }
    }
  };
});

export default function GlobalStyles() {
  useStyles();
  return null;
}
