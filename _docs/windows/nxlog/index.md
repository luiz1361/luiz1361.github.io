#  nxlog.conf


define ROOT C:\Program Files (x86)\nxlog

Moduledir %ROOT%\modules
CacheDir %ROOT%\data
Pidfile %ROOT%\data\nxlog.pid
SpoolDir %ROOT%\data
LogFile %ROOT%\data\nxlog.log

<Extension gelf>
    Module xm_gelf
</Extension>
<Input in>
    # For windows vista/2008 and above use:
    Module      im_msvistalog

    # For windows 2003 and earlier use the following:
    #   Module      im_mseventlog
</Input>

<Output out>
    Module      om_udp
    Host        192.168.0.1
    Port        12201
    OutputType  GELF
</Output>

<Route 1>
    Path        in => out
</Route>
